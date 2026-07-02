import { initTRPC } from '@trpc/server';
import { getCorrelationId } from '../../utils/helpers/request.helper';
const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

