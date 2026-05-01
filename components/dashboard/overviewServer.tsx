'use server';

import { getOverView } from '@/actions/overview';
import React from 'react';
import Overview, { OverviewType } from './overview';

const OverviewServer = async () => {

    const { data }: any = await getOverView();
    
    // Pass undefined - client will use its own date
    // This avoids server/client date mismatch
    const now = undefined;

    return <Overview overviewData={data} now={now} />
}

export default OverviewServer;