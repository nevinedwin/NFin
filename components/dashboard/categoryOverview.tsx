'use client';

import React from 'react';
import { TopCategory } from '@/actions/overview';
import DashboardCard from './dashboardCard';
import { Progress } from '../ui/progress';
import { Field, FieldLabel } from '../ui/field';
import CategoryIcon from '../ui/caetgoryIcon';
import HorizontalLine from '../ui/horizontalLine';
import ShowBalanceComp from '../ui/showBalance';

const CategoryOverview = ({ category }: { category: TopCategory[] }) => {
    return <DashboardCard
        headerContent={
            <div className='w-full h-fit px-4 py-2'>
                <p className='text-md font-semibold'>Where did I spend</p>
            </div>
        }
        content={
            <div className='w-full h-full flex flex-col p-4 gap-4'>
                {
                    category.length === 0 && (
                        <div>No expenses</div>
                    )
                }
                {
                    category.length > 0 && category.map((c, i) => (
                        <div className='space-y-4' key={c.categoryId}>
                            <div className='w-full flex justify-start items-center gap-4'>
                                <CategoryIcon name={c.icon ?? 'ArrowRightLeft'} className={`w-5 h-5`} containerClassName="w-6 h-6 flex item-center justify-center" />
                                <Field className="w-full flex-1 max-w-sm" >
                                    <FieldLabel htmlFor="progress-upload">
                                        <span className='text-[15px] font-normal tracking-wide'>{c.name}</span>
                                        <span className="ml-auto text-xs font-thin">{c.percentage}%</span>
                                    </FieldLabel>
                                    <Progress value={c.percentage} id="progress-upload"
                                        className="h-[4px] bg-border [&>div]:bg-blue-500" />
                                </Field>
                                <div className='w-[30%] flex items-center justify-end text-[16px] font-semibold tracking-wider'>
                                    <ShowBalanceComp balance={c.amount} mainClass='text-[16px]' subClass='text-[10px] pb-[5px]'/>
                                </div>
                            </div>
                            {i !== category.length - 1 && <HorizontalLine isBlueLine={false} />}
                        </div>
                    ))
                }
            </div>
        }
    />
}

export default CategoryOverview
