import type { Url, UploadableEntity } from "@/lib/types";

type List = (string | File)[];
type FileOrUrl = Url | File;

class Entity<TValue> {
    constructor(
        public orderId: number,
        public value: TValue,
    ) {}

    static isEntityUrl(
        entity: Entity<FileOrUrl | string>,
    ): entity is Entity<Url> {
        return (
            typeof entity.value === "string" &&
            entity.value.startsWith("https://")
        );
    }

    static isEntityFile(entity: Entity<FileOrUrl>): entity is Entity<File> {
        return entity.value instanceof File;
    }
}
export class UploadableMapper {
    #entities: Entity<FileOrUrl>[];
    #urlToUpload: Url;
    #uploadableEntities: UploadableEntity[];
    #uploadedEntities: Entity<Url>[];

    constructor(list: List, urlToUpload: Url) {
        this.#urlToUpload = urlToUpload;
        this.#entities = this.#mapListOrder(list);
        this.#uploadableEntities = this.#getUploadableEntities();
        this.#uploadedEntities = this.getUploadedEntities();
    }

    #mapListOrder(list: List): Entity<FileOrUrl>[] {
        return list.map((item, index) => {
            if (typeof item === "string") {
                UploadableMapper.#assertIsUrl(item);
                return new Entity<Url>(index, item);
            }
            return new Entity<File>(index, item);
        });
    }

    #getUploadableEntities(): UploadableEntity[] {
        return this.#entities.reduce<UploadableEntity[]>((acc, entity) => {
            if (
                Entity.isEntityFile(entity) &&
                !entity.value.name.startsWith(this.#urlToUpload)
            ) {
                const name = `${crypto.randomUUID()}-${entity.value.name.replace("/", "-")}`;

                acc.push({
                    name,
                    orderId: entity.orderId,
                    file: entity.value,
                    urlPath: `${this.#urlToUpload}/${name}` as Url,
                });
            }
            return acc;
        }, []);
    }

    getUploadedEntities(): Entity<Url>[] {
        return this.#entities.reduce<Entity<Url>[]>((acc, entity) => {
            if (
                typeof entity.value === "string" &&
                entity.value.startsWith(this.#urlToUpload) &&
                Entity.isEntityUrl(entity)
            ) {
                acc.push(entity);
            }

            if (
                entity.value instanceof File &&
                entity.value.name.startsWith(this.#urlToUpload)
            ) {
                const newEntity = new Entity(entity.orderId, entity.value.name);

                if (Entity.isEntityUrl(newEntity)) {
                    acc.push(newEntity);
                }
            }

            return acc;
        }, []);
    }

    getUrlPaths(): Url[] {
        return [...this.#uploadableEntities, ...this.#uploadedEntities]
            .sort((a, b) => a.orderId - b.orderId)
            .map(entity =>
                entity instanceof Entity ? entity.value : entity.urlPath,
            );
    }

    getFilesToUpload(): UploadableEntity[] {
        return this.#uploadableEntities;
    }

    static #assertIsUrl(value: string): asserts value is Url {
        if (!value.startsWith("https://")) {
            throw new Error("Value is not a URL");
        }
    }
}
