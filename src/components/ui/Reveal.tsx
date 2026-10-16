import { motion, useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
export function Reveal({children,className=''}:PropsWithChildren<{className?:string}>){const reduce=useReducedMotion();return <motion.div className={className} initial={reduce?false:{opacity:0,y:18}} whileInView={reduce?undefined:{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.35,ease:'easeOut'}}>{children}</motion.div>}
