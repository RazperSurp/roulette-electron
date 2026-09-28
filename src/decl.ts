const GameType = {
    solo: 1,
    vsbot: 2
} as const

export type GameType = (typeof GameType)[keyof typeof GameType];