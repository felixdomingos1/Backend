export interface ContactUserData {
    name: string
    email: string
    message: string
    phone: string
}


export interface ContactResponse {
    success: boolean
    message?: string
    token?: string
    contact?: {
        id: string
        name: string
        email: string
        times: string
        message: string
        phone: string
        createdAt: Date
        updatedAt: Date
    }
}

export interface ContactForm {
    name: string
    email: string
    message: string
    phone: string
}