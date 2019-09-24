import React from 'react';
import BlockUi from 'react-block-ui';
import { observer, inject } from 'mobx-react';

const emptyLoader = () => <span></span>;

/**
 * UILockerContainer HOC Component
 */
function UILockerContainer({ card, gameStore, children, isLocked = false }){
    return (
        <BlockUi loader={emptyLoader} className="ui-locker" tag="div" blocking={isLocked}>
            { children }
        </BlockUi>
    );
}

export default inject("gameStore")(observer(UILockerContainer));