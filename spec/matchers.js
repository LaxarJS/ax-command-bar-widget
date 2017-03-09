/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
export default {
   toContainButtonWithAction() {
      return {
         compare( buttonList, expected ) {
            const jsonList = JSON.stringify( buttonList );
            const pass = buttonList.some( ({ action }) => action === expected );
            return {
               pass,
               message: pass ?
                  `Expected area "${jsonList}" not to contain button with action "${expected}"` :
                  `Expected area "${jsonList}" to contain button with action "${expected}"`
            };
         }
      };
   },
   toHaveAction() {
      return {
         compare( button, expected ) {
            const pass = button.action === expected;
            return {
               pass,
               message: pass ?
                  `Expected button "${JSON.stringify( button )}" not to have action "${expected}"` :
                  `Expected button "${JSON.stringify( button )}" to have action "${expected}"`
            };
         }
      };
   }
};
