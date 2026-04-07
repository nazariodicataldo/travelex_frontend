import { Post } from "../post/post.type"

export type User = {
    id: string,
    username: string,
    email: string,
    posts: Post[]
}