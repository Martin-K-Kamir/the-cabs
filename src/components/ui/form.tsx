"use client";

import * as React from "react";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { ImageOffIcon, XIcon } from "lucide-react";
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    type FormProviderProps,
} from "react-hook-form";

import { cn } from "@/lib/utils/core/cn";
import {
    eventEmitter,
    type EventEmitter,
} from "@/lib/utils/core/event-emitter";
import { isFileArray } from "@/lib/utils/predicates/is-file-array";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/lazy-image";

// const Form = FormProvider;

type EmmiterEvent = "reset"; // fix later

const FormEmmitterContext = createContext<EventEmitter<EmmiterEvent> | null>(
    null,
);

function useFormEmitter() {
    const context = useContext(FormEmmitterContext);

    if (!context) {
        throw new Error("useFormEmitter should be used within <FormEmmitter/>");
    }

    return context;
}

function Form<TFieldValues extends FieldValues>({
    emitter,
    children,
    ...props
}: FormProviderProps<TFieldValues> & {
    emitter?: EventEmitter<EmmiterEvent>;
}) {
    return (
        <FormEmmitterContext.Provider value={emitter ?? eventEmitter()}>
            <FormProvider {...props}>{children}</FormProvider>
        </FormEmmitterContext.Provider>
    );
}

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue,
);

type FormFilesContextValue = {
    files: File[];
    addFiles: (files: File | File[]) => void;
    setFiles: (files: File[]) => void;
    removeFile: (file: File) => void;
    clearFiles: () => void;
};

const FormFilesContext = createContext<FormFilesContextValue | null>(null);

function FormFilesProvider({ children }: { children: React.ReactNode }) {
    const [files, setFiles] = useState<File[]>([]);

    const addFiles = useCallback((files: File | File[]) => {
        setFiles(prevFiles => {
            const newFiles = Array.isArray(files) ? files : [files];
            return [...prevFiles, ...newFiles].filter(
                (file, index, self) =>
                    index === self.findIndex(f => f.name === file.name),
            );
        });
    }, []);

    const removeFile = useCallback((file: File) => {
        setFiles(prevFiles => prevFiles.filter(f => f.name !== file.name));
    }, []);

    const clearFiles = useCallback(() => {
        setFiles([]);
    }, []);

    return (
        <FormFilesContext.Provider
            value={{ files, addFiles, removeFile, clearFiles, setFiles }}
        >
            {children}
        </FormFilesContext.Provider>
    );
}

const useFormFiles = () => {
    const context = useContext(FormFilesContext);

    if (!context) {
        throw new Error(
            "useFormFiles should be used within <FormFilesProvider/>",
        );
    }

    return context;
};

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <FormFilesProvider>
                <Controller {...props} />
            </FormFilesProvider>
        </FormFieldContext.Provider>
    );
};

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>");
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        defaultValue: formState.defaultValues?.[fieldContext.name] as unknown,
        ...fieldState,
    };
};

type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue,
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                data-slot="form-item"
                className={cn("group/item grid gap-2.5", className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
}

function FormPopover({
    className,
    children,
    ...props
}: React.ComponentProps<typeof Popover> & {
    className?: string;
}) {
    return (
        <Popover {...props}>
            <FormItem className={className}>{children}</FormItem>
        </Popover>
    );
}

function FormPopoverTrigger({
    children,
    showReset = true,
    className,
    classNameReset,
    classNameWrapper,
    ...props
}: React.ComponentProps<typeof Button> & {
    showReset?: boolean;
    classNameReset?: string;
    classNameWrapper?: string;
}) {
    const { isDirty, name } = useFormField();
    const { resetField } = useFormContext();

    return (
        <div className={cn("relative grid items-center", classNameWrapper)}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button {...props} className={className}>
                        {children}
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                    "absolute right-4",
                    (!isDirty || !showReset) && "hidden",
                    classNameReset,
                )}
                onClick={() => {
                    resetField(name);
                }}
            >
                <XIcon />
            </Button>
        </div>
    );
}

function FormPopoverContent(
    props: React.ComponentProps<typeof PopoverContent>,
) {
    return <PopoverContent {...props} />;
}

function FormLabel({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    const { error, formItemId } = useFormField();

    return (
        <Label
            data-slot="form-label"
            data-error={!!error}
            className={cn("data-[error=true]:text-rose-500", className)}
            htmlFor={formItemId}
            {...props}
        />
    );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField();

    return (
        <Slot
            data-slot="form-control"
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
    const { formDescriptionId } = useFormField();

    return (
        <p
            data-slot="form-description"
            id={formDescriptionId}
            className={cn(
                "text-sm text-zinc-500 dark:text-zinc-400",
                className,
            )}
            {...props}
        />
    );
}

function findNestedError(error: { message?: string }): string | null {
    if (error?.message) {
        return error.message;
    }

    if (typeof error === "object" && error !== null) {
        for (const key in error) {
            const nestedError = findNestedError(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (error as Record<string, any>)[key],
            );
            if (nestedError) {
                return nestedError;
            }
        }
    }

    return null;
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
    const { error, formMessageId } = useFormField();
    const body = error
        ? error?.message
            ? error.message
            : findNestedError(error)
        : props.children;

    if (!body) {
        return null;
    }

    return (
        <p
            data-slot="form-message"
            id={formMessageId}
            className={cn("text-sm text-rose-500", className)}
            {...props}
        >
            {body}
        </p>
    );
}

function FormDropBox({
    className,
    single,
    children,
    onDragLeave,
    onDragOver,
    onDrop,
    ...props
}: Omit<React.ComponentProps<typeof LabelPrimitive.Root>, "children"> & {
    children: React.ReactNode | ((files: File[]) => React.ReactNode);
    single?: boolean;
}) {
    const { files, clearFiles, addFiles, setFiles } = useFormFiles();
    const [isDragOver, setIsDragOver] = useState(false);
    const { error, formItemId } = useFormField();

    useEffect(() => {
        return () => {
            clearFiles();
        };
    }, [clearFiles]);

    function handleDragLeave(event: React.DragEvent<HTMLLabelElement>) {
        setIsDragOver(false);
        onDragLeave?.(event);
    }

    function handleDragOver(event: React.DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
        onDragOver?.(event);
    }

    function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver?.(false);
        onDrop?.(event);

        if (single) {
            setFiles(Array.from(event.dataTransfer.files).slice(0, 1));
        } else {
            addFiles(Array.from(event.dataTransfer.files));
        }
    }

    return (
        <Label
            data-slot="form-label"
            data-error={!!error}
            className={cn(
                "cursor-pointer rounded-lg border border-dashed border-zinc-700 bg-zinc-900 p-6 text-sm text-zinc-300 ring-zinc-300/30 transition-all hover:bg-zinc-800 group-has-[input:focus]/item:bg-zinc-800 group-has-[input:focus]/item:ring-2 data-[drag-over='true']:border-zinc-400 data-[error='true']:!border-rose-600 data-[drag-over='true']:bg-zinc-800 data-[error='true']:ring-rose-800",
                className,
            )}
            htmlFor={formItemId}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-drag-over={isDragOver}
            {...props}
        >
            {typeof children === "function" ? children(files) : children}
        </Label>
    );
}

function FormDropInput({
    value, // eslint-disable-line @typescript-eslint/no-unused-vars
    className,
    multiple,
    onChange,
    ...props
}: Omit<React.ComponentProps<"input">, "onChange" | "value"> & {
    value?: File[];
    onChange?: (files: File[]) => void;
}) {
    const { files, clearFiles, addFiles, setFiles } = useFormFiles();
    const { on, off } = useFormEmitter();
    const { name, defaultValue } = useFormField();
    const { watch } = useFormContext();
    const watchedValues = watch(name) as File[] | undefined;
    const [inputKey, setInputKey] = useState(0);

    useEffect(() => {
        if (watchedValues && watchedValues.length > 0) {
            setFiles(watchedValues);
        }
    }, []);

    useEffect(() => {
        if (watchedValues?.length === 0) {
            clearFiles();
        }
    }, [watchedValues, clearFiles]);

    useEffect(() => {
        if (files.length > 0) {
            onChange?.(files);
        }
    }, [files]);

    useEffect(() => {
        const handleReset = () => {
            if (!isFileArray(defaultValue)) {
                return;
            }

            setFiles(defaultValue);
        };

        on("reset", handleReset);

        return () => {
            off("reset", handleReset);
        };
    }, [off, on]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const targetFiles = Array.from(event.target.files || []);

        if (multiple) {
            const availableFiles =
                targetFiles.length === 0 && files.length > 0
                    ? files
                    : targetFiles;

            addFiles(availableFiles);
            onChange?.(availableFiles);
        } else {
            setFiles(targetFiles);
            onChange?.(targetFiles);
        }

        setInputKey(prevKey => prevKey + 1);
    }

    return (
        <input
            key={inputKey}
            type="file"
            data-slot="input"
            className={cn("sr-only", className)}
            multiple={multiple}
            {...props}
            onChange={handleChange}
        />
    );
}

async function processAvatar(avatar?: File | string) {
    if (!avatar) return null;

    if (typeof avatar === "string") {
        const response = await fetch(avatar);
        const blob = await response.blob();
        const mime = blob.type || "image/png";
        return new File([blob], "avatar.png", { type: mime });
    }

    if (avatar instanceof File) {
        return avatar;
    }

    return null;
}

function FormImageUploadPreview({
    lazy = true,
    value,
    className,
    classNameImage,
}: React.ComponentProps<"div"> & {
    classNameImage?: string;
    value?: (File | string)[] | File | string;
    lazy?: boolean;
}) {
    const { files, removeFile, setFiles } = useFormFiles();
    const { name } = useFormField();
    const { setValue } = useFormContext();
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [imagesOrder, setImagesOrder] = useState(() => {
        if (value !== undefined) {
            return [new File([], "")];
        }

        return files;
    });
    const isDragable = isFileArray(files) && files.length > 1;

    useEffect(() => {
        setImagesOrder(files);
    }, [files]);

    useEffect(() => {
        if (isFileArray(value)) {
            setFiles(value);
            setValue(name, value);
        } else if (typeof value === "string") {
            processAvatar(value).then(avatar => {
                if (!avatar) {
                    return;
                }

                setFiles([avatar]);
                setValue(name, [avatar]);
                setImagesOrder([avatar]);
            });
        }
    }, [value, setFiles]);

    function handleDragStart(
        event: React.DragEvent<HTMLDivElement>,
        index: number,
        image: File,
    ) {
        if (!isDragable) return;

        setDraggedIndex(index);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.items.add(image);
    }

    function handleDragOver(
        event: React.DragEvent<HTMLDivElement>,
        index: number,
    ) {
        if (!isDragable) return;

        event.preventDefault();

        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...imagesOrder];
        const [draggedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);

        setImagesOrder(newImages);
        setDraggedIndex(index);
    }

    function handleDrop() {
        if (!isDragable) return;

        setDraggedIndex(null);
        setFiles(imagesOrder);
        setValue(name, imagesOrder);
    }

    function handleDragEnd() {
        if (!isDragable) return;

        setDraggedIndex(null);
    }

    function handleRemoveFile(file: File) {
        removeFile(file);

        setValue(
            name,
            imagesOrder.filter(image => image.name !== file.name),
        );
    }

    return (
        <div className={cn(!className && "grid grid-cols-4 gap-2", className)}>
            {imagesOrder.map((image, index) => (
                <FormImagePreviewItem
                    key={image.name ?? index}
                    index={index}
                    draggedIndex={draggedIndex}
                    image={image}
                    className={classNameImage}
                    onDragStart={event => handleDragStart(event, index, image)}
                    onDragOver={event => handleDragOver(event, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    onRemoveFile={handleRemoveFile}
                    isDragable={isDragable}
                    lazy={lazy}
                />
            ))}
        </div>
    );
}

type FormImagePreviewItemProps = {
    index: number;
    draggedIndex: number | null;
    image: File;
    className?: string;
    isDragable?: boolean;
    lazy?: boolean;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: () => void;
    onDrop: () => void;
    onRemoveFile: (file: File) => void;
};

function FormImagePreviewItem({
    image,
    index,
    isDragable = true,
    lazy,
    draggedIndex,
    className,
    onDragEnd,
    onDragOver,
    onDrop,
    onDragStart,
    onRemoveFile,
}: FormImagePreviewItemProps) {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isError, setIsError] = useState(false);

    if (image.name === "") {
        return null;
    }

    return (
        <div
            className={cn(
                "group relative rounded-xl border border-dashed border-transparent transition-all duration-200",
                draggedIndex === index && "border-zinc-700 bg-zinc-900",
            )}
            draggable={isDragable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDrop={onDrop}
        >
            {lazy && !isError && (
                <LazyImage
                    src={
                        image.name?.startsWith("https://")
                            ? image.name
                            : URL.createObjectURL(image)
                    }
                    alt={`Preview of ${image.name}`}
                    className={cn(
                        "h-full w-full rounded-xl object-cover transition-[opacity,filter]",
                        draggedIndex === index && "opacity-0",
                        isDragable &&
                            draggedIndex === null &&
                            "hover:brightness-80",
                        isDragable && "cursor-move",
                        className,
                    )}
                    classNameLoader={className}
                    isLoaded={isImageLoaded}
                    onLoad={() => setIsImageLoaded(true)}
                />
            )}

            {!lazy && !isError && (
                <img
                    src={
                        image.name?.startsWith("https://")
                            ? image.name
                            : URL.createObjectURL(image)
                    }
                    alt={`Preview of ${image.name}`}
                    className={cn(
                        "h-full w-full rounded-xl object-cover transition-[opacity,filter]",
                        draggedIndex === index && "opacity-0",
                        isDragable &&
                            draggedIndex === null &&
                            "hover:brightness-80",
                        isDragable && "cursor-move",
                        className,
                    )}
                    onError={() => {
                        setIsError(true);
                        setIsImageLoaded(true);
                    }}
                    onLoad={() => {
                        setIsImageLoaded(true);
                    }}
                />
            )}

            {isImageLoaded && isError && (
                <div
                    className={cn(
                        "flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl bg-zinc-800 p-2 text-center",
                        className,
                    )}
                >
                    <ImageOffIcon className="size-4 text-rose-300" />
                    <p className="text-[11px] font-medium text-rose-300">
                        Error loading image
                    </p>
                </div>
            )}

            {isImageLoaded && !isError && (
                <Button
                    variant="blurred"
                    type="button"
                    size="icon"
                    className={cn(
                        "absolute right-1.5 top-1.5 hidden size-6 rounded-full group-hover:flex",
                        draggedIndex !== null && "opacity-0",
                    )}
                    onClick={() => onRemoveFile(image)}
                >
                    <XIcon className="size-3.5" />
                </Button>
            )}
        </div>
    );
}

export {
    useFormField,
    Form,
    FormItem,
    FormPopover,
    FormPopoverTrigger,
    FormPopoverContent,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
    FormImageUploadPreview,
    FormDropInput,
    FormDropBox,
    FormFilesProvider,
};
