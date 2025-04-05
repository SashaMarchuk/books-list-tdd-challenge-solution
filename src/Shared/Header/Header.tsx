import React from 'react';
import { observer } from 'mobx-react';
import { booksStore } from '../../Books/Books.controller';

interface HeaderStyles {
    header: React.CSSProperties;
}

const styles: HeaderStyles = {
    header: {
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        textAlign: 'right',
    }
}

/**
 * Header component displaying the count of private books.
 * Observes the `booksStore` for changes to the private book count.
 * Features a sticky position at the top of the viewport.
 * @component
 */
const Header: React.FC = () => {
    return (
        <div style={styles.header} className="app-header">
            Your books: {booksStore.privateBooksCount}
        </div>
    );
}

export default observer(Header); 