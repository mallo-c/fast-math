import type {Settings} from "@/settingsInterface";

/* Modify settings here */
const SETTINGS: Settings = {
    numberOfStars: 10,
    answerTime: 4,
    answerVariants: 3,
    taskGenerator: {
        maxNumber: "linear",
        minNumber: 1,
        ratio: 2
    },
    resetTimeIfWrong: false,
    doReset: true,
    penalty: 0
}

export default SETTINGS;
