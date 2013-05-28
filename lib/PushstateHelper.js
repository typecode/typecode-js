/* ============================================================================

 >4SESz.,     _,     ,gSEE2zx.,_        .azx                    ,w.
@Sh. "QEE3.  JEE3.  &ss  `*4EEEEE2x.,_  "EEV  ,aS5^;dEEEE2x.,   VEEF  _
\E2`_,gF4EEEx.?jF   EE5L       `*4EEEEE2zpn..ZEEF ;sz.  `*EEESzw.w* '|EE.
  ,dEEF   `"?j]  _,_   ,_  _,     _,.     L.EEEF  !EEF  _,,  `"``    EE7   ,,_
 :EEE7 ,ws,`|EEL`JEEL`JEE)`JEEL zE5` E3. / [EE3  ,w.  zE2` Ek .zE5^JZE3.,6EF [3
 {EEE. VEE7.EE2  AE3. EEV  ZEEL{EEL ws. ;  [EE1  EEEt{E3. JEELEE3. JE5LJEEF ,w,
  \EEk,,>^ JEEL,@EEF ZE5L,ZE5^ "Q3. V2`.    \EEk,,J' "Q[ yE2^ VE[_zEE[,"QEL V5F
          ,ss  :EE7 ;EEF               L,szzw..            ,.,            ``
          \E5.,E5F  EE1.              /; ``*4EEEZhw._      EEEL
            ````     ``              JEEE.     `"45EEEhw.,,,]

From 2010 till ∞
typecode-js v 0.1
*/

define(['jquery'], function($) {

    var window = this,
    NI = window.NI;

    function PushstateHelper(options) {

        var self = this, o, internal, fn, handlers;

        o = $.extend({
            app: null,
            use_hash: false
        }, options);

        internal = {
            name: 'mod.PushstateHelper'
        };

        fn = {
            init: function() {
                $(document).on('click', '.js-use-pushstate, .js-simulate-pushstate', handlers.doc_click);
                $(window).on('popstate', handlers.popstate).on('pushstate', handlers.pushstate).on('simulate-pushstate', handlers.simulate_pushstate);
                o.app.events.on('app.featuresInitialized', handlers.features_initialized);
                if(o.use_hash){
                    fn.statechange(window.location.hash);
                } else {
                    fn.statechange(window.location.pathname);
                }
            },
            statechange: function(pathname){
                var i, path_components, position;

                path_components = PushstateHelper.get_path_components(pathname);

                // push the state change to Google Analytics
                if(window._gaq){
                    _gaq.push(['_trackPageview', pathname]);
                }

                o.app.events.trigger('navigationEvent:Pushstate', {
                    path: pathname,
                    components: path_components
                });
            },

            get_path_components: function(){
                return internal.components;
            }
        };

        handlers = {
            features_initialized: function(e,d){
                //fn.statechange(window.location);
            },
            doc_click: function(e, d) {
                var _href;
                e.preventDefault();
                _href = $(this).attr('HREF');
                if(!$(this).hasClass('js-simulate-pushstate')){
                    if(o.use_hash){
                        window.location.hash = _href;
                        fn.statechange(window.location.hash);
                    } else {
                        history.pushState(null, null, _href);
                        fn.statechange(window.location.pathname);
                    }
                    
                } else {
                    fn.statechange(_href);
                }
            },
            popstate: function(e, d) {
                if(o.use_hash){
                    fn.statechange(window.location.hash);
                } else {
                    fn.statechange(window.location.pathname);
                }
            },
            pushstate: function(e, d) {
                if(o.use_hash){
                    if(window.location.hash != d.pathname){
                        window.location.hash = d.pathname;
                    }
                } else {
                    if(window.location.pathname != d.pathname){
                        history.pushState(null, null, d.pathname);
                    }
                }
                if(!d.prevent_propagation){
                    fn.statechange(d.pathname);
                }
            },
            simulate_pushstate: function(e, d) {
                if(!d.prevent_propagation){
                    fn.statechange(d.pathname);
                }
            }
        };

        this.get_path_components = fn.get_path_components;

        fn.init();
        console.log(internal);
    }

    PushstateHelper.get_path_components = function(path){
        var components, position;
        components = [];
        components = path.split('/');
        position = components.length;
        while(position--){
            if(!components[position].length){
                components.splice(position,1);
            }
        }
        return components;
    };

    NI.PushstateHelper = PushstateHelper;

    return PushstateHelper;

});