import { Variants } from "motion/react";

export const chatListVar: Variants = {
    'hide': {
        x: "-100%",
        transition: {duration: .4, ease: "easeInOut"}
    },
    'show': {
        x: "0",
        transition: {duration: .4, ease: "easeInOut"}
    }
}