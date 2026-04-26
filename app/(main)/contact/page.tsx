'use server';

import React from 'react'
import ContactPage from '../features/contact/contactPage';
import { getContacts } from '@/actions/contacts';

const PAGE_SIZE = 10;

const Contact = async () => {

  const initalContacts = await getContacts({ cursor: null, take: PAGE_SIZE, search: '' });

  return (
    <ContactPage initialContacts={initalContacts.data} initialCursor={initalContacts.nextCursor}/>
  )
}

export default Contact;