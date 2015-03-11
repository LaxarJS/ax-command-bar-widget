/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
define( [
   '../ax-command-bar-widget',
   'laxar/laxar_testing',
   './fixtures'
], function( navigator, ax, testData ) {
   'use strict';

   var testBed_;

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'An AxCommandBarWidget', function() {

      beforeEach( function setup() {
         testBed_ = testBedAfterDidNavigate( this, { buttons: [] } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      afterEach( function() {
         testBed_.tearDown();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'defines three distinct areas for buttons (R1.1)', function() {
         expect( testBed_.scope.model.areas.left ).toBeDefined();
         expect( testBed_.scope.model.areas.center ).toBeDefined();
         expect( testBed_.scope.model.areas.right ).toBeDefined();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'renders no buttons by default', function() {
         expect( testBed_.scope.model.areas.left.length ).toBe( 0 );
         expect( testBed_.scope.model.areas.center.length ).toBe( 0 );
         expect( testBed_.scope.model.areas.right.length ).toBe( 0 );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'An AxCommandBarWidget with some custom buttons', function() {

      describe( 'when no buttons are disabled', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.customAllEnabledButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'puts them into the correct areas (R1.2, R2.4)', function() {
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action1' );
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action2' );
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action3' );
            expect( testBed_.scope.model.areas.center ).toContainButtonWithAction( 'action4' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'action5' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts them by their index (R2.4)', function() {
            expect( testBed_.scope.model.areas.left[0] ).toHaveAction( 'action3' );
            expect( testBed_.scope.model.areas.left[1] ).toHaveAction( 'action1' );
            expect( testBed_.scope.model.areas.left[2] ).toHaveAction( 'action2' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sets the css class for class-attribute (R2.5)', function() {
            expect( testBed_.scope.model.areas.right[0].classes[ 'btn-success' ] ).toBe( true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sets the css class for size-attribute (R2.6)', function() {
            expect( testBed_.scope.model.areas.center[0].classes[ 'btn-sm' ] ).toBe( true );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when some buttons are disabled', function() {

         beforeEach( function() {
            testData.customAllEnabledButtons.buttons[1].enabled = false;
            testData.customAllEnabledButtons.buttons[3].enabled = false;
            testBed_ = testBedAfterDidNavigate( this, testData.customAllEnabledButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            testData.customAllEnabledButtons.buttons[1].enabled = true;
            testData.customAllEnabledButtons.buttons[3].enabled = true;
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'does not render these buttons (R2.1)', function() {
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action1' );
            expect( testBed_.scope.model.areas.left ).not.toContainButtonWithAction( 'action2' );
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'action3' );
            expect( testBed_.scope.model.areas.center ).not.toContainButtonWithAction( 'action4' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'action5' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when no buttons are disabled and some buttons have index and some have no index', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.sortTestButtons.customButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts them by their index (R2.4)', function() {
            var buttonOrder = [ 15, 1, 2, 3, 4, 5, 10, 11, 6, 12, 13, 7, 14, 8, 9 ];
            testBed_.scope.model.areas.left.forEach( function( button, i ) {
               expect( button ).toHaveAction( 'action' + buttonOrder[ i ] );
            } );
         } );

      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'An AxCommandBarWidget with some default buttons', function() {

      describe( 'when no buttons are disabled', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.defaultAllEnabledButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'puts them into the correct areas (R3.1)', function() {
            expect( testBed_.scope.model.areas.left ).toContainButtonWithAction( 'previous' );
            expect( testBed_.scope.model.areas.center ).toContainButtonWithAction( 'help' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'next' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'cancel' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts them by their index (R3.1)', function() {
            expect( testBed_.scope.model.areas.right[0] ).toHaveAction( 'cancel' );
            expect( testBed_.scope.model.areas.right[1] ).toHaveAction( 'next' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when some buttons are disabled', function() {

         beforeEach( function() {
            testData.defaultAllEnabledButtons.previous.enabled = false;
            testData.defaultAllEnabledButtons.next.enabled = false;
            testBed_ = testBedAfterDidNavigate( this, testData.defaultAllEnabledButtons );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            testData.defaultAllEnabledButtons.previous.enabled = true;
            testData.defaultAllEnabledButtons.next.enabled = true;
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'does not render these buttons (R3.1)', function() {
            expect( testBed_.scope.model.areas.left ).not.toContainButtonWithAction( 'previous' );
            expect( testBed_.scope.model.areas.center ).toContainButtonWithAction( 'help' );
            expect( testBed_.scope.model.areas.right ).not.toContainButtonWithAction( 'next' );
            expect( testBed_.scope.model.areas.right ).toContainButtonWithAction( 'cancel' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'and some of the buttons have index and some have no index', function() {

         beforeEach( function() {
            testBed_ = testBedAfterDidNavigate( this, testData.sortTestButtons.defaultButtons );
         } );

         //////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sorts them by their index and inserts default buttons before custom buttons having the same index (R2.4)', function() {
            var buttonOrder = [ 11, 7, 8, 1, 3, 4, 5, 9, 12, 10, 2 ];
            testBed_.scope.model.areas.left.forEach( function( button, i ) {
               expect( button ).toHaveAction( 'action' + buttonOrder[ i ] );
            } );
         } );

      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'An AxCommandBarWidget with both custom and default buttons', function() {

      describe( '', function() {

         var originalCustomButtons;

         beforeEach( function() {
            originalCustomButtons = testData.defaultAllEnabledButtons.buttons;
            var features = testData.defaultAllEnabledButtons;
            features.buttons = testData.customAllEnabledButtons.buttons;

            testBed_ = testBedAfterDidNavigate( this, features );
            changeLocale( 'en-US' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         afterEach( function() {
            testData.defaultAllEnabledButtons.buttons = originalCustomButtons;
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'inserts default buttons before custom buttons having the same index (R3.2)', function() {
            expect( testBed_.scope.model.areas.right[0] ).toHaveAction( 'cancel' );
            expect( testBed_.scope.model.areas.right[1] ).toHaveAction( 'action5' );
            expect( testBed_.scope.model.areas.right[2] ).toHaveAction( 'next' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'creates a view label for a simple string (R2.2)', function() {
            expect( testBed_.scope.model.areas.right[1].htmlLabel ).toEqual( 'Action 5' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'creates a view label for a localized object based on the current locale (R2.2)', function() {
            changeLocale( 'de' );
            var next = testBed_.scope.model.areas.right[2];
            expect( next.htmlLabel ).toEqual( '<i class=\"icon-circle-arrow-right\"></i> Weiter' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and some of the buttons have index and some have no index', function() {

            beforeEach( function() {
               testBed_ = testBedAfterDidNavigate( this, testData.sortTestButtons.defaultAndCustomButtons );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'sorts them by their index and inserts default buttons before custom buttons having the same index (R2.4, R3.2)', function() {
               var buttonOrder = [ 16, 15, 1, 2, 3, 4, 5, 10, 11, 18, 6, 12, 13, 7, 14, 17, 8, 9 ];
               testBed_.scope.model.areas.left.forEach( function( button, i ) {
                  expect( button ).toHaveAction( 'action' + buttonOrder[ i ] );
               } );
            } );

         } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'An AxCommandBarWidget with buttons', function() {

      beforeEach( function() {
         testBed_ = testBedAfterDidNavigate( this, testData.defaultAllEnabledButtons );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when configured flags change', function() {

         var mySpy;
         var nextButton;
         var helpButton;
         var previousButton;

         function publishFlagChange( flag, state ) {
            testBed_.scope.eventBus.publish( 'didChangeFlag.' + flag + '.' + state, {
               flag: flag,
               state: state
            } );
            jasmine.Clock.tick( 0 );
         }

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         beforeEach( function() {
            mySpy = jasmine.createSpy( 'takeActionRequestSpy' );
            testBed_.scope.eventBus.subscribe( 'takeActionRequest', mySpy );

            nextButton = testBed_.scope.model.areas.right[1];
            helpButton = testBed_.scope.model.areas.center[0];
            previousButton = testBed_.scope.model.areas.left[0];

            publishFlagChange( 'helpAvailable', true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'on true the according css classes are applied (R2.7)', function() {
            expect( nextButton.classes['ax-invisible'] ).toBe( false );
            expect( nextButton.classes['ax-busy'] ).toBe( false );
            expect( helpButton.classes['ax-omitted'] ).toBe( false );
            expect( previousButton.classes['ax-disabled'] ).toBe( false );

            publishFlagChange( 'guestUser', true );
            publishFlagChange( 'navigation', true );
            publishFlagChange( 'helpAvailable', false );
            publishFlagChange( 'notUndoable', true );

            expect( nextButton.classes['ax-invisible'] ).toBe( true );
            expect( nextButton.classes['ax-busy'] ).toBe( true );
            expect( helpButton.classes['ax-omitted'] ).toBe( true );
            expect( previousButton.classes['ax-disabled'] ).toBe( true );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'when all flags are active', function() {

            beforeEach( function() {
               publishFlagChange( 'guestUser', true );
               publishFlagChange( 'navigation', true );
               publishFlagChange( 'helpAvailable', false );
               publishFlagChange( 'notUndoable', true );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'on false the according css classes are removed (R2.7)', function() {
               expect( nextButton.classes['ax-invisible'] ).toBe( true );
               expect( nextButton.classes['ax-busy'] ).toBe( true );
               expect( helpButton.classes['ax-omitted'] ).toBe( true );
               expect( previousButton.classes['ax-disabled'] ).toBe( true );

               publishFlagChange( 'guestUser', false );
               publishFlagChange( 'navigation', false );
               publishFlagChange( 'helpAvailable', true );
               publishFlagChange( 'notUndoable', false );

               expect( nextButton.classes['ax-invisible'] ).toBe( false );
               expect( nextButton.classes['ax-busy'] ).toBe( false );
               expect( helpButton.classes['ax-omitted'] ).toBe( false );
               expect( previousButton.classes['ax-disabled'] ).toBe( false );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'no user interaction is possible (R2.7)', function() {
               testBed_.scope.handleButtonClicked( nextButton );
               testBed_.scope.handleButtonClicked( helpButton );
               testBed_.scope.handleButtonClicked( previousButton );
               jasmine.Clock.tick( 0 );

               expect( mySpy.callCount ).toBe( 0 );
            } );

            //////////////////////////////////////////////////////////////////////////////////////////////////

            it( 'on false user interaction is possible again (R2.7)', function() {
               publishFlagChange( 'guestUser', false );
               publishFlagChange( 'navigation', false );
               publishFlagChange( 'helpAvailable', true );
               publishFlagChange( 'notUndoable', false );

               testBed_.scope.handleButtonClicked( nextButton );
               testBed_.scope.handleButtonClicked( helpButton );
               testBed_.scope.handleButtonClicked( previousButton );
               jasmine.Clock.tick( 0 );

               expect( mySpy.callCount ).toBe( 3 );
            } );

         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'when a button is pressed', function() {

         var actionEvent;
         var actionEventName;
         var signalActionFinished;
         var nextButton;

         beforeEach( function() {
            nextButton = testBed_.scope.model.areas.right[ 1 ];

            var action;
            testBed_.scope.eventBus.subscribe( 'takeActionRequest', function( event, meta ) {
               action = event.action;
               actionEvent = event;
               actionEventName = meta.name;
               testBed_.scope.eventBus.publish( 'willTakeAction.' + action, { sender: 'spec' } );
               jasmine.Clock.tick( 0 );
            } );
            signalActionFinished = function() {
               testBed_.scope.eventBus.publish( 'didTakeAction.' + action, { sender: 'spec' } );
               jasmine.Clock.tick( 0 );
            };
            testBed_.scope.handleButtonClicked( nextButton );
            jasmine.Clock.tick( 0 );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'an event with the configured action is published (R2.9)', function() {
            expect( actionEventName ).toEqual( 'takeActionRequest.next' );
            expect( actionEvent.action ).toEqual( 'next' );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'the according button has the css class is-active as long as the action is ongoing', function() {
            expect( nextButton.classes[ 'ax-active' ] ).toBe( true );

            signalActionFinished();

            expect( nextButton.classes[ 'ax-active' ] ).toBe( false );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and the action is canceled', function() {

            beforeEach( function() {
               signalActionFinished();
               var q = ax.testing.portalMocks.mockQ();
               testBed_.scope.eventBus.publishAndGatherReplies.andCallFake( q.reject );
               testBed_.scope.handleButtonClicked( nextButton );
            } );

            it( 'resets the button state', function() {
               expect( nextButton.classes[ 'ax-active' ] ).toBe( true );
               jasmine.Clock.tick( 0 );
               expect( nextButton.classes[ 'ax-active' ] ).toBe( false );
            } );

         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         it( 'sends the button\'s id as event.anchorDomElement (R2.9)', function() {
            expect( actionEvent.anchorDomElement ).toEqual( testBed_.scope.id( 'next_0' ) );
         } );

         /////////////////////////////////////////////////////////////////////////////////////////////////////

         describe( 'and the button is pressed again before a didTakeAction event was received', function() {

            it( 'doesn\'t publish a takeActionRequest event twice (R2.9)', function() {
               expect( actionEventName ).toEqual( 'takeActionRequest.next' );

               actionEventName = 'resetEventName';
               testBed_.scope.handleButtonClicked( nextButton );
               jasmine.Clock.tick( 0 );
               expect( actionEventName ).toEqual( 'resetEventName' );

               signalActionFinished();
               testBed_.scope.handleButtonClicked( nextButton );
               jasmine.Clock.tick( 0 );
               expect( actionEventName ).toEqual( 'takeActionRequest.next' );
            } );
         } );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'An AxCommandBarWidget with buttons with same action', function() {

      beforeEach( function() {
         testBed_ = testBedAfterDidNavigate( this, testData.customWithSameAction );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'has individual ids for each button (R2.9)', function() {
         expect( testBed_.scope.model.areas.left[ 0 ].id ).not.
            toEqual( testBed_.scope.model.areas.left[ 1 ].id );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'An AxCommandBarWidget', function() {

      function setup( self, layout ) {
         var features = {
            buttons: [
               { i18nHtmlLabel: 'Action 1', action: 'action1' },
               { i18nHtmlLabel: 'Action 2', action: 'action2' }
            ]
         };

         if( layout ) {
            features.layout = layout;
         }

         testBed_ = testBedAfterDidNavigate( self, features );
      }

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with no explicit layout configuration', function() {

         it( 'displays the buttons horizontally (R4.1)', function() {
            setup( this );
            expect( testBed_.scope.model.layout ).toEqual( 'ax-local-horizontal' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with configured layout variant HORIZONTAL', function() {

         it( 'displays the buttons horizontally (R4.1)', function() {
            setup( this, { variant: 'HORIZONTAL' } );
            expect( testBed_.scope.model.layout ).toEqual( 'ax-local-horizontal' );
         } );

      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      describe( 'with configured layout variant VERTICAL', function() {

         it( 'displays the buttons vertically (R4.1)', function() {
            setup( this, { variant: 'VERTICAL' } );
            expect( testBed_.scope.model.layout ).toEqual( 'ax-local-vertical' );
         } );

      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function testBedAfterDidNavigate( self, features ) {
      addButtonMatchers( self );

      var testBed = ax.testing.portalMocksAngular.createControllerTestBed( 'laxarjs/ax-command-bar-widget' );
      testBed.featuresMock = features;

      testBed.useWidgetJson();
      testBed.setup();

      return testBed;
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function addButtonMatchers( self ) {
      self.addMatchers( {
         toContainButtonWithAction: function( expectedAction ) {
            var buttonList = this.actual;
            for( var i = 0; i < buttonList.length; ++i ) {
               if( buttonList[ i ].action === expectedAction ) {
                  return true;
               }
            }
            return false;
         },
         toHaveAction: function( expectedAction ) {
            return this.actual.action === expectedAction;
         }
      } );
   }

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   function changeLocale( languageTag, locale ) {
      locale = locale || 'default';
      testBed_.eventBusMock.publish( 'didChangeLocale.' + locale, {
         locale: locale,
         languageTag: languageTag
      } );
      jasmine.Clock.tick( 0 );
   }

} );
