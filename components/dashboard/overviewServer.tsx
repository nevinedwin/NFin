'use server';

import { getOverView } from '@/actions/overview';
import React from 'react';
import Overview, { OverviewType } from './overview';

const OverviewServer = async () => {

    const { data }: any = await getOverView();
    
    const now = new Date().toISOString();

    return <Overview overviewData={data} now={now} />
}

export default OverviewServer;