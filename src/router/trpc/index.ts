import {router} from "./context"
import { urlRouter } from "./url.trpc"
export const trpcRouter = router({
    url:urlRouter
})