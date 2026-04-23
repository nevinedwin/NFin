// 'use client';

// import { transactionGroupFormInitalState } from '@/app/(main)/features/transaction/transaction.state';
// import { useForm } from '@/hooks/form/useForm';
// import { RUPEE_SYMBOL } from '@/lib/constants/constants';
// import React from 'react';

// const Group = () => {

//     const { state: formState, setField, reset } = useForm(transactionGroupFormInitalState);
//     const { amount, description, repeat, type, accountId, categoryId,  } = formState;


//     return (
//         <div className='h-full w-full flex justify-center items-center'>
//             <div>
//                 <label className="text-sm text-slate-500">Amount</label>

//                 <div className="flex items-center border border-border rounded-xl px-3 h-14">
//                     <span className="text-xl font-semibold mr-2">{RUPEE_SYMBOL}</span>

//                     <input
//                         name="amount"
//                         type="number"
//                         value={amount}
//                         ref={amountRef}
//                         onChange={(e) => {
//                             setField("amount", e.target.value)
//                         }}
//                         placeholder="0.00"
//                         inputMode="decimal"
//                         required
//                         step={0.01}
//                         min={0}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter") {
//                                 e.preventDefault();
//                                 if (type === 'TRANSFER') {
//                                     accountRef.current?.focus();
//                                 } else {
//                                     categoryRef.current?.focus();
//                                 }
//                             }
//                         }}
//                         className="w-full outline-none text-2xl font-bold bg-black"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Group;