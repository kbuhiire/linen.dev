import React from 'react';
import styles from './index.module.css';
import { GoCommentDiscussion } from 'react-icons/go';

export default function Empty() {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <GoCommentDiscussion className="text-3xl" />
      </div>
      <h2 className="font-bold text-2xl mb-2">No messages</h2>
      <p className="text-gray-700 text-sm">Looks like the channel is empty.</p>
    </div>
  );
}
