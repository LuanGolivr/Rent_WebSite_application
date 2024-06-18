export type Params = {
    property_id?: string
    available?: boolean
    sell_or_rent?: string
    property_type?: string
    title?: string
    property_description?: string
    street?: string
    neighborhood?: string
    city?: string
    property_state?: string
    furnished?: boolean
    rooms?: number
    suites?: number
    bathrooms?: number
    parking_space?: number
    minArea?: number
    maxArea?: number
    minCond?: number
    maxCond?: number
    minPrice?: number
    maxPrice?: number
    gym?: boolean
    playground?: boolean
    elevator?: boolean
    gourmet_area?: boolean
    sport_court?: boolean
    water_pool?: boolean
    warm_pool?: boolean
    green_area?: boolean
    property_owner?: number
    skip?: number
}

export type Query = {
    text: string
    values: any[]
}

export type Post = {
    id?: number
    title: string
    text: string
}

export type ManyPosts = {
    data: Post[]
}

export type DeletePost = {
    data: number[]
}