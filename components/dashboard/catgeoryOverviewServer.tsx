'use server';

import { getCategoryOverview, getOverView } from '@/actions/overview';
import React from 'react';
import CategoryOverview from './categoryOverview';

const CategoryOverviewServer = async () => {

    const { data }: any = await getCategoryOverview();
    console.log(data);

    return <CategoryOverview category={data} />
}

export default CategoryOverviewServer;