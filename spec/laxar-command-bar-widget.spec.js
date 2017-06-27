/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import 'angular';
import 'angular-mocks';
import * as axMocks from 'laxar-mocks';
import * as ax from 'laxar';
import matchers from './matchers';
import testData from './fixtures';

let widgetEventBus;
let widgetScope;
let testEventBus;

function createSetup( widgetConfiguration ) {
   beforeEach( axMocks.setupForWidget() );

   beforeEach( () => {
      axMocks.widget.configure(
         typeof widgetConfiguration === 'function' ?
         widgetConfiguration() :
         widgetConfiguration
      );
   } );

   beforeEach( axMocks.widget.load );

   beforeEach( () => {
      widgetScope = axMocks.widget.$scope;
      widgetEventBus = axMocks.widget.axEventBus;
      testEventBus = axMocks.eventBus;
   } );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

beforeEach( () => {
   jasmine.addMatchers( matchers );
} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

afterEach( axMocks.tearDown );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'A laxar-command-bar-widget', () => {

   createSetup( { buttons: [] } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'defines three distinct areas for buttons (R1.1)', () => {
      expect( widgetScope.model.areas.left ).toBeDefined();
      expect( widgetScope.model.areas.center ).toBeDefined();
      expect( widgetScope.model.areas.right ).toBeDefined();
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'renders no buttons by default', () => {
      expect( widgetScope.model.areas.left.length ).toBe( 0 );
      expect( widgetScope.model.areas.center.length ).toBe( 0 );
      expect( widgetScope.model.areas.right.length ).toBe( 0 );
   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'An AxCommandBarWidget with some custom buttons', () => {

   describe( 'when no buttons are disabled', () => {

      createSetup( testData.customAllEnabledButtons );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'puts them into the correct areas (R1.2, R2.4)', () => {
         expect( widgetScope.model.areas.left ).toContainButtonWithAction( 'action1' );
         expect( widgetScope.model.areas.left ).toContainButtonWithAction( 'action2' );
         expect( widgetScope.model.areas.left ).toContainButtonWithAction( 'action3' );
         expect( widgetScope.model.areas.center ).toContainButtonWithAction( 'action4' );
         expect( widgetScope.model.areas.right ).toContainButtonWithAction( 'action5' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sorts them by their index (R2.4)', () => {
         expect( widgetScope.model.areas.left[ 0 ] ).toHaveAction( 'action3' );
         expect( widgetScope.model.areas.left[ 1 ] ).toHaveAction( 'action1' );
         expect( widgetScope.model.areas.left[ 2 ] ).toHaveAction( 'action2' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sets the css class for class-attribute (R2.5)', () => {
         expect( widgetScope.model.areas.right[ 0 ].classes[ 'btn-success' ] ).toBe( true );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sets the css class for size-attribute (R2.6)', () => {
         expect( widgetScope.model.areas.center[ 0 ].classes[ 'btn-sm' ] ).toBe( true );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when some buttons are disabled', () => {

      beforeEach( () => {
         testData.customAllEnabledButtons.buttons[ 1 ].enabled = false;
         testData.customAllEnabledButtons.buttons[ 3 ].enabled = false;
      } );

      createSetup( testData.customAllEnabledButtons );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( () => {
         testData.customAllEnabledButtons.buttons[ 1 ].enabled = true;
         testData.customAllEnabledButtons.buttons[ 3 ].enabled = true;
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'does not render these buttons (R2.1)', () => {
         expect( widgetScope.model.areas.left ).toContainButtonWithAction( 'action1' );
         expect( widgetScope.model.areas.left ).not.toContainButtonWithAction( 'action2' );
         expect( widgetScope.model.areas.left ).toContainButtonWithAction( 'action3' );
         expect( widgetScope.model.areas.center ).not.toContainButtonWithAction( 'action4' );
         expect( widgetScope.model.areas.right ).toContainButtonWithAction( 'action5' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when no buttons are disabled and some buttons have index and some have no index', () => {

      createSetup( testData.sortTestButtons.customButtons );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sorts them by their index (R2.4)', () => {
         const buttonOrder = [ 15, 1, 2, 3, 4, 5, 10, 11, 6, 12, 13, 7, 14, 8, 9 ];
         widgetScope.model.areas.left.forEach( ( button, i ) => {
            expect( button ).toHaveAction( `action${buttonOrder[ i ]}` );
         } );
      } );

   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'An AxCommandBarWidget with some default buttons', () => {

   describe( 'when no buttons are disabled', () => {

      createSetup( testData.defaultAllEnabledButtons );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'puts them into the correct areas (R3.1)', () => {
         expect( widgetScope.model.areas.left ).toContainButtonWithAction( 'previous' );
         expect( widgetScope.model.areas.center ).toContainButtonWithAction( 'help' );
         expect( widgetScope.model.areas.right ).toContainButtonWithAction( 'next' );
         expect( widgetScope.model.areas.right ).toContainButtonWithAction( 'cancel' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sorts them by their index (R3.1)', () => {
         expect( widgetScope.model.areas.right[ 0 ] ).toHaveAction( 'cancel' );
         expect( widgetScope.model.areas.right[ 1 ] ).toHaveAction( 'next' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when some buttons are disabled', () => {

      beforeEach( () => {
         testData.defaultAllEnabledButtons.previous.enabled = false;
         testData.defaultAllEnabledButtons.next.enabled = false;
      } );

      createSetup( testData.defaultAllEnabledButtons );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( () => {
         testData.defaultAllEnabledButtons.previous.enabled = true;
         testData.defaultAllEnabledButtons.next.enabled = true;
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'does not render these buttons (R3.1)', () => {
         expect( widgetScope.model.areas.left ).not.toContainButtonWithAction( 'previous' );
         expect( widgetScope.model.areas.center ).toContainButtonWithAction( 'help' );
         expect( widgetScope.model.areas.right ).not.toContainButtonWithAction( 'next' );
         expect( widgetScope.model.areas.right ).toContainButtonWithAction( 'cancel' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'and some of the buttons have index and some have no index', () => {

      createSetup( testData.sortTestButtons.defaultButtons );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sorts them by index, with default buttons before custom buttons of same index (R2.4)', () => {
         const buttonOrder = [ 11, 7, 8, 1, 3, 4, 5, 9, 12, 10, 2 ];
         widgetScope.model.areas.left.forEach( ( button, i ) => {
            expect( button ).toHaveAction( `action${buttonOrder[ i ]}` );
         } );
      } );

   } );
} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'An AxCommandBarWidget with both custom and default buttons', () => {

   describe( 'when setup', () => {

      createSetup( () => {
         const features = ax.object.deepClone( testData.defaultAllEnabledButtons );
         features.buttons = testData.customAllEnabledButtons.buttons;
         return features;
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'inserts default buttons before custom buttons having the same index (R3.2)', () => {
         expect( widgetScope.model.areas.right[ 0 ] ).toHaveAction( 'cancel' );
         expect( widgetScope.model.areas.right[ 1 ] ).toHaveAction( 'action5' );
         expect( widgetScope.model.areas.right[ 2 ] ).toHaveAction( 'next' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'creates a view label for a simple string (R2.2)', () => {
         expect( widgetScope.model.areas.right[ 1 ].htmlLabel ).toEqual( 'Action 5' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'creates a view label for a localized object based on the current locale (R2.2)', () => {
         useLocale( 'de' );
         const next = widgetScope.model.areas.right[ 2 ];
         expect( next.htmlLabel ).toEqual( '<i class="icon-circle-arrow-right"></i> Weiter' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when some of the buttons have an index and some have no index', () => {

      createSetup( testData.sortTestButtons.defaultAndCustomButtons );

      it( 'sorts them by index, with default buttons before custom buttons of same index (R2.4)', () => {
         const buttonOrder = [ 16, 15, 1, 2, 3, 4, 5, 10, 11, 18, 6, 12, 13, 7, 14, 17, 8, 9 ];
         widgetScope.model.areas.left.forEach( ( button, i ) => {
            expect( button ).toHaveAction( `action${buttonOrder[ i ]}` );
         } );
      } );

   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'An AxCommandBarWidget with buttons', () => {

   createSetup( testData.defaultAllEnabledButtons );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when configured flags change', () => {

      let mySpy;
      let nextButton;
      let helpButton;
      let previousButton;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      beforeEach( () => {
         mySpy = jasmine.createSpy( 'takeActionRequestSpy' );
         widgetEventBus.subscribe( 'takeActionRequest', mySpy );

         nextButton = widgetScope.model.areas.right[ 1 ];
         helpButton = widgetScope.model.areas.center[ 0 ];
         previousButton = widgetScope.model.areas.left[ 0 ];

         changeFlagAndFlush( 'helpAvailable', true );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'on true the according css classes are applied (R2.7)', () => {
         expect( nextButton.classes[ 'ax-invisible' ] ).toBe( false );
         expect( nextButton.classes[ 'ax-busy' ] ).toBe( false );
         expect( helpButton.classes[ 'ax-omitted' ] ).toBe( false );
         expect( previousButton.classes[ 'ax-disabled' ] ).toBe( false );

         changeFlagAndFlush( 'guestUser', true );
         changeFlagAndFlush( 'navigation', true );
         changeFlagAndFlush( 'helpAvailable', false );
         changeFlagAndFlush( 'notUndoable', true );

         expect( nextButton.classes[ 'ax-invisible' ] ).toBe( true );
         expect( nextButton.classes[ 'ax-busy' ] ).toBe( true );
         expect( helpButton.classes[ 'ax-omitted' ] ).toBe( true );
         expect( previousButton.classes[ 'ax-disabled' ] ).toBe( true );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when all flags are active', () => {

         beforeEach( () => {
            changeFlagAndFlush( 'guestUser', true );
            changeFlagAndFlush( 'navigation', true );
            changeFlagAndFlush( 'helpAvailable', false );
            changeFlagAndFlush( 'notUndoable', true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'on false the according css classes are removed (R2.7)', () => {
            expect( nextButton.classes[ 'ax-invisible' ] ).toBe( true );
            expect( nextButton.classes[ 'ax-busy' ] ).toBe( true );
            expect( helpButton.classes[ 'ax-omitted' ] ).toBe( true );
            expect( previousButton.classes[ 'ax-disabled' ] ).toBe( true );

            changeFlagAndFlush( 'guestUser', false );
            changeFlagAndFlush( 'navigation', false );
            changeFlagAndFlush( 'helpAvailable', true );
            changeFlagAndFlush( 'notUndoable', false );

            expect( nextButton.classes[ 'ax-invisible' ] ).toBe( false );
            expect( nextButton.classes[ 'ax-busy' ] ).toBe( false );
            expect( helpButton.classes[ 'ax-omitted' ] ).toBe( false );
            expect( previousButton.classes[ 'ax-disabled' ] ).toBe( false );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'no user interaction is possible (R2.7)', () => {
            widgetScope.handleButtonClicked( nextButton );
            widgetScope.handleButtonClicked( helpButton );
            widgetScope.handleButtonClicked( previousButton );
            testEventBus.flush();

            expect( mySpy.calls.count() ).toEqual( 0 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'on false user interaction is possible again (R2.7)', () => {
            changeFlagAndFlush( 'guestUser', false );
            changeFlagAndFlush( 'navigation', false );
            changeFlagAndFlush( 'helpAvailable', true );
            changeFlagAndFlush( 'notUndoable', false );

            widgetScope.handleButtonClicked( nextButton );
            widgetScope.handleButtonClicked( helpButton );
            widgetScope.handleButtonClicked( previousButton );
            testEventBus.flush();

            expect( mySpy.calls.count() ).toEqual( 3 );
         } );

      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'when a button is pressed', () => {

      let actionEvent;
      let actionEventName;
      let signalActionFinished;
      let nextButton;

      beforeEach( () => {
         nextButton = widgetScope.model.areas.right[ 1 ];

         let action;
         widgetScope.eventBus.subscribe( 'takeActionRequest', ( event, meta ) => {
            action = event.action;
            actionEvent = event;
            actionEventName = meta.name;
            widgetScope.eventBus.publish( `willTakeAction.${action}`, { sender: 'spec' } );
            testEventBus.flush();
         } );
         signalActionFinished = () => {
            widgetScope.eventBus.publish( `didTakeAction.${action}`, { sender: 'spec' } );
            testEventBus.flush();
         };
         widgetScope.handleButtonClicked( nextButton );
         testEventBus.flush();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'publishes an event with the configured action (R2.9)', () => {
         expect( actionEventName ).toEqual( 'takeActionRequest.next' );
         expect( actionEvent.action ).toEqual( 'next' );
         signalActionFinished();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'assigns the class `ax-active` to the corresponding button while the action is ongoing', done => {
         expect( nextButton.classes[ 'ax-active' ] ).toBe( true );
         signalActionFinished();
         awaitGatherReplies().then( () => {
            expect( nextButton.classes[ 'ax-active' ] ).toBe( false );
            done();
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'and the action is canceled', () => {

         beforeEach( () => {
            signalActionFinished();
            widgetEventBus.publishAndGatherReplies.and.callFake( () => Promise.reject() );
            widgetScope.handleButtonClicked( nextButton );
         } );

         it( 'resets the button state', done => {
            expect( nextButton.classes[ 'ax-active' ] ).toBe( true );
            widgetScope.$apply();
            awaitGatherReplies().then( () => {
               expect( nextButton.classes[ 'ax-active' ] ).toBe( false );
               done();
            } );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'sends the button\'s id as event.anchorDomElement (R2.9)', () => {
         expect( actionEvent.anchorDomElement ).toEqual( widgetScope.id( 'next_0' ) );
         signalActionFinished();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'and the button is pressed again before a didTakeAction event was received', () => {

         beforeEach( () => {
            expect( actionEventName ).toEqual( 'takeActionRequest.next' );

            actionEventName = null;
            widgetScope.handleButtonClicked( nextButton );
            testEventBus.flush();

         } );

         it( 'doesn\'t publish the takeActionRequest event twice (R2.9)', () => {
            expect( actionEventName ).toBe( null );

            signalActionFinished();
            widgetScope.handleButtonClicked( nextButton );

            // TODO
            // testEventBus.flush();
            // expect( actionEventName ).toEqual( 'takeActionRequest.next' );
         } );

      } );

   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'An AxCommandBarWidget with buttons with same action', () => {

   createSetup( testData.customWithSameAction );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'has individual ids for each button (R2.9)', () => {
      expect( widgetScope.model.areas.left[ 0 ].id )
         .not.toEqual( widgetScope.model.areas.left[ 1 ].id );
   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( 'An AxCommandBarWidget with special config', () => {

   describe( 'with no explicit layout configuration', () => {
      const features = {
         buttons: [
            { i18nHtmlLabel: 'Action 1', action: 'action1' },
            { i18nHtmlLabel: 'Action 2', action: 'action2' }
         ]
      };
      createSetup( features );

      it( 'displays the buttons horizontally (R4.1)', () => {
         expect( widgetScope.model.layout ).toEqual( 'ax-local-horizontal' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured layout variant HORIZONTAL', () => {
      const features = {
         buttons: [
            { i18nHtmlLabel: 'Action 1', action: 'action1' },
            { i18nHtmlLabel: 'Action 2', action: 'action2' }
         ],
         layout: { variant: 'HORIZONTAL' }
      };
      createSetup( features );

      it( 'displays the buttons horizontally (R4.1)', () => {
         expect( widgetScope.model.layout ).toEqual( 'ax-local-horizontal' );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'with configured layout variant VERTICAL', () => {
      const features = {
         buttons: [
            { i18nHtmlLabel: 'Action 1', action: 'action1' },
            { i18nHtmlLabel: 'Action 2', action: 'action2' }
         ],
         layout: { variant: 'VERTICAL' }
      };
      createSetup( features );

      it( 'displays the buttons vertically (R4.1)', () => {
         expect( widgetScope.model.layout ).toEqual( 'ax-local-vertical' );
      } );

   } );

} );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function awaitGatherReplies() {
   return new Promise( resolve => { window.setTimeout( resolve, 0 ); } );
}

function useLocale( languageTag, locale = 'default' ) {
   testEventBus.publish( `didChangeLocale.${locale}`, { locale, languageTag } );
   testEventBus.flush();
}

function changeFlagAndFlush( flag, state, sender = 'spec' ) {
   testEventBus.publish( `didChangeFlag.${flag}.${state}`, { flag, state }, { sender } );
   testEventBus.flush();
}
