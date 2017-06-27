/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license
 * www.laxarjs.org
 */
import * as ng from 'angular';
import * as patterns from 'laxar-patterns';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const GRID_COLUMN_CLASS_PREFIX = 'col-lg-';
const BUTTON_CLASS_PREFIX = 'btn-';
const BUTTON_CLASS_ACTIVE = 'ax-active';
const BUTTON_CLASS_HIDDEN = 'ax-invisible';
const BUTTON_CLASS_OMITTED = 'ax-omitted';
const BUTTON_CLASS_BUSY = 'ax-busy';
const BUTTON_CLASS_DISABLED = 'ax-disabled';

const BUTTON_STATE_TRIGGER_TO_CLASS_MAP = {
   hideOn: BUTTON_CLASS_HIDDEN,
   omitOn: BUTTON_CLASS_OMITTED,
   disableOn: BUTTON_CLASS_DISABLED,
   busyOn: BUTTON_CLASS_BUSY
};

const CONFIG_TO_BOOTSTRAP_STYLE_MAP = {
   NORMAL: 'default',
   PRIMARY: 'primary',
   INFO: 'info',
   SUCCESS: 'success',
   WARNING: 'warning',
   DANGER: 'danger',
   INVERSE: 'inverse',
   LINK: 'link'
};

const CONFIG_TO_BOOTSTRAP_SIZE_MAP = {
   MINI: 'xs',
   SMALL: 'sm',
   LARGE: 'lg'
};

const DEFAULT_BUTTONS =
   [ 'previous', 'next', 'finish', 'ok', 'cancel', 'close', 'info', 'help', 'print', 'apply', 'yes', 'no' ];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

Controller.$inject = [ '$scope', 'axI18n', 'axFeatures', 'axEventBus' ];

function Controller( $scope, i18n, features, eventBus ) {

   const allButtons = buttonsFromAllFeatures();
   const flagHandler = patterns.flags.handlerFor( $scope );

   i18n.whenLocaleChanged( updateLocalization );

   const areaOrder = [ 'left', 'center', 'right' ];
   const areas = areaOrder.reduce( ( areas, areaName ) => {
      areas[ areaName ] = allButtons
         .filter( button => areaName === button.align.toLowerCase() )
         .map( ( button, index ) => {
            button.id = $scope.id( `${button.action}_${index}` );
            button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
            button.classes = buttonStyleClasses( button );

            Object.keys( BUTTON_STATE_TRIGGER_TO_CLASS_MAP ).forEach( flagName => {
               const className = BUTTON_STATE_TRIGGER_TO_CLASS_MAP[ flagName ];
               flagHandler.registerFlag( button[ flagName ], {
                  initialState: button.classes[ className ],
                  onChange( newState ) {
                     button.classes[ className ] = newState;
                  }
               } );
            } );

            return button;
         } );

      areas[ areaName ].sort( ( buttonA, buttonB ) =>
         buttonA.index === buttonB.index ?
            buttonA.fallbackIndex - buttonB.fallbackIndex :
            buttonA.index - buttonB.index );
      return areas;
   }, {} );

   const areaClasses = areaOrder.reduce( ( classes, areaName ) => {
      const { columnWidth } = features.areas[ areaName ];
      classes[ areaName ] = typeof columnWidth === 'number' ?
         [ GRID_COLUMN_CLASS_PREFIX + columnWidth ] :
         [];
      return classes;
   }, {} );

   $scope.model = {
      areaOrder,
      areas,
      areaClasses,
      layout: features.layout.variant === 'VERTICAL' ? 'ax-local-vertical' : 'ax-local-horizontal'
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function updateLocalization() {
      $scope.model.areaOrder.forEach( areaName => {
         $scope.model.areas[ areaName ].forEach( button => {
            button.htmlLabel = i18n.localize( button.i18nHtmlLabel );
         } );
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   $scope.handleButtonClicked = ({ classes, action, id }) => {
      const shouldCancel = classes[ BUTTON_CLASS_ACTIVE ] || Object.keys( BUTTON_STATE_TRIGGER_TO_CLASS_MAP )
         .some( stateTrigger => classes[ BUTTON_STATE_TRIGGER_TO_CLASS_MAP[ stateTrigger ] ] );
      if( shouldCancel ) { return; }

      classes[ BUTTON_CLASS_ACTIVE ] = true;
      function reset() {
         classes[ BUTTON_CLASS_ACTIVE ] = false;
      }
      eventBus.publishAndGatherReplies( `takeActionRequest.${action}`, {
         action,
         anchorDomElement: id
      } ).then( reset, reset );
   };

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function buttonsFromAllFeatures() {
      const buttons = $scope.features.buttons.map( ( button, i ) => {
         button.fallbackIndex = i + DEFAULT_BUTTONS.length;
         return button;
      } );
      DEFAULT_BUTTONS.forEach( ( buttonFeatureName, i ) => {
         const button = $scope.features[ buttonFeatureName ];
         if( button ) {
            button.fallbackIndex = i;
            buttons.push( button );
         }
      } );
      return buttons.filter( button => button.enabled );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function buttonStyleClasses( buttonConfiguration ) {
      const classes = {};
      classes[ BUTTON_CLASS_ACTIVE ] = false;
      classes[ BUTTON_CLASS_HIDDEN ] = false;
      classes[ BUTTON_CLASS_DISABLED ] = false;
      classes[ BUTTON_CLASS_OMITTED ] = false;
      classes[ BUTTON_CLASS_BUSY ] = false;

      const buttonClass = buttonConfiguration[ 'class' ];
      if( buttonClass ) {
         const typePart =
            CONFIG_TO_BOOTSTRAP_STYLE_MAP[ buttonClass ] ||
            CONFIG_TO_BOOTSTRAP_STYLE_MAP.NORMAL;
         const styleClass = BUTTON_CLASS_PREFIX + typePart;
         classes[ styleClass ] = true;
      }

      const { size = 'DEFAULT' } = buttonConfiguration;
      if( size !== 'DEFAULT' ) {
         const sizeClass = BUTTON_CLASS_PREFIX + CONFIG_TO_BOOTSTRAP_SIZE_MAP[ size ];
         classes[ sizeClass ] = true;
      }

      return classes;
   }
}


export const name = ng.module( 'laxarCommandBarWidget', [] )
   .controller( 'LaxarCommandBarWidgetController', Controller )
   .name;
