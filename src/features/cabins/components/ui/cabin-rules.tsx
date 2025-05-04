import {
    CalendarXIcon,
    Clock4Icon,
    PawPrintIcon,
    ShieldAlertIcon,
    UserPenIcon,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function CabinRules({
    className,
    ...props
}: React.ComponentProps<typeof Accordion>) {
    return (
        <Accordion className={cn("w-full", className)} {...props}>
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <span className="flex items-center gap-3">
                        <Clock4Icon />
                        Check-in & out times
                    </span>
                </AccordionTrigger>
                <AccordionContent>
                    Check-in anytime after 4:00 pm, and check-out anytime before
                    11:00 am.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                    <span className="flex items-center gap-3">
                        <UserPenIcon />
                        Edit Your Stay Anytime
                    </span>
                </AccordionTrigger>
                <AccordionContent>
                    You can edit your stay anytime. Just give us a call or
                    online.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>
                    <span className="flex items-center gap-3">
                        <CalendarXIcon />
                        Easy cancellation
                    </span>
                </AccordionTrigger>
                <AccordionContent>
                    Cancel your trip for up to 14 days prior to start and
                    receive a full refund.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>
                    <span className="flex items-center gap-3">
                        <PawPrintIcon />
                        Pets allowed
                    </span>
                </AccordionTrigger>
                <AccordionContent>
                    Pets are allowed in this property. You can bring your pet
                    with you.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>
                    <span className="flex items-center gap-3">
                        <ShieldAlertIcon />
                        Safety & Security
                    </span>
                </AccordionTrigger>
                <AccordionContent>
                    This property has a security system and a fire alarm system.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
