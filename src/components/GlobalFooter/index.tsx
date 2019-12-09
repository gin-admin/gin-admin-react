import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export interface GlobalFooterInterface {
  className?: any;
  links?: any;
  copyright?: any;
}

export default ({ className, links, copyright }: any) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      {links && (
        <div className={styles.links}>
          {links.map((link: { title: any; blankTarget: any; href: string | undefined }) => (
            <a key={link.title} target={link.blankTarget ? '_blank' : '_self'} href={link.href}>
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className={styles.copyright}>{copyright}</div>}
    </div>
  );
};
