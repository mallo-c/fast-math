interface ConstMaxNumber {
    maxNumber: number
}
interface DynamicMaxNumber {
    maxNumber: "linear",
    minNumber: number
    ratio: number
}
export interface Settings {
    numberOfStars: number,
    answerTime: number,
    answerVariants: number,
    taskGenerator: ConstMaxNumber|DynamicMaxNumber,
    resetTimeIfWrong: boolean,
    doReset: boolean,
    penalty: number
}
