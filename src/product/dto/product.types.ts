import { Product, Image } from "@prisma/client"

type ProductType = Product & {averageRating: number, cover?: Image}

export type AllProductsType = {
    products: ProductType[],
    nextPage?: number
    prevPage?: number
}