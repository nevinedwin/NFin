'use server';

import { getOverView } from '@/actions/overview';
import React from 'react';
import Overview, { OverviewType } from './overview';

const OverviewServer = async () => {

    // const { data }: any = await getOverView();
    const data: any = [];

    return <Overview overviewData={data} />
}

export default OverviewServer;