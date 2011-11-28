/*    _____                    _____          
     /\    \                  /\    \         
    /::\    \                /::\    \        
    \:::\    \              /::::\    \       
     \:::\    \            /::::::\    \      
      \:::\    \          /:::/\:::\    \     
       \:::\    \        /:::/  \:::\    \    
       /::::\    \      /:::/    \:::\    \   
      /::::::\    \    /:::/    / \:::\    \  
     /:::/\:::\    \  /:::/    /   \:::\    \ 
    /:::/  \:::\____\/:::/____/     \:::\____\
   /:::/    \::/    /\:::\    \      \::/    /
  /:::/    / \/____/  \:::\    \      \/____/ 
 /:::/    /            \:::\    \             
/:::/    /              \:::\    \            
\::/    /                \:::\    \           
 \/____/                  \:::\    \          
                           \:::\    \         
                            \:::\____\        
                             \::/    /        
                              \/____/         
                             TYPE/CODE        
                         From 2010 till ∞     
                         typecode-js v0.1       
                                                */

(function(window, $) {
	
	var NI = window.NI;
	
	function MerlinData(options){
		
		var o, internal;
		
		o = $.extend({
			uri:'',
			data:{},
			post_unchanged_data:true,
			post_method:'POST'
		},options);
		
		internal = {
			uri:o.uri,
			base_data:$.extend({},o.data),
			data:$.extend({},o.data)
		};

		this.init = function(me){
			var i;

			if(me.data){
				internal.data = $.extend(internal.data,me.data);
			}

			me.get_data = this.get_data;
			me.set_data = this.set_data;
			
			me.get_val = this.get_val;
			me.set_val = this.set_val;
		}
		
		this.populate_fields = function(me,fields){
			
			var i;
			
			if(fields){
				for(i in fields){
					if(me.internal.current_step.fields[fields[i]] && internal.data[fields[i]]){
						if(me.internal.current_step.fields[fields[i]].component.get_val() != this.get_val(fields[i])){
							console.log(me.internal.current_step.fields[fields[i]].component.get_val());
							console.log(this.get_val(fields[i]));

							me.internal.current_step.fields[fields[i]].component.set_val(this.get_val(fields[i]),true);
						}
					}
				}
			} else {
				for(i in this.get_data()){
					
					if(me.internal.current_step.fields[i]){
						if(!me.internal.current_step.fields[i].component){
							continue;
						}
						if(me.internal.current_step.fields[i].component.get_val() != this.get_val(i)){
							console.log(me.internal.current_step.fields[i].component.get_val());
							console.log(this.get_val(i));
							me.internal.current_step.fields[i].component.set_val(this.get_val(i),true);
						}
					}
				}
			}
			
		};
		
		this.collect_fields = function(me, fields){
			
			var i, temp_name;
			
			if(fields){
				for(i in fields){
					if(me.internal.current_step.fields[fields[i]]){
						this.set_val(fields[i], me.internal.current_step.fields[fields[i]].component.get_val());
					}
				}
			} else {
				for(i in this.get_data()){
					if(me.internal.current_step.fields[i]){
						if(!me.internal.current_step.fields[i].component){
							continue;
						}
						this.set_val(i, me.internal.current_step.fields[i].component.get_val());
					}
				}
			}

		};

		this.get_uri = function(){
			return internal.uri;
		};

		this.set_uri = function(uri){
			internal.uri = uri;
		};
		
		this.get_data = function(){
			return internal.data;
		};
		
		this.set_data = function(new_data,use_for_base_data){
			internal.data = new_data;
			if(use_for_base_data){
				internal.base_data = $.extend({},new_data);
			}
		};
		
		this.get_val = function(id){
			return internal.data[id];
		};
		
		this.set_val = function(id,new_val){
			internal.data[id] = new_val;
		};
		
		this.post_data = function(callback,options){

			var cleaned_data, i;

			cleaned_data = $.extend({},this.get_data());

			for(i in cleaned_data){
				if(cleaned_data[i] === null){
					delete cleaned_data[i];
				}
				if(o.post_unchanged_data === false){
					if(cleaned_data[i] === internal.base_data[i] && i != 'csrfmiddlewaretoken'){
						delete cleaned_data[i];
					}
				}
			}

			$.ajax({
				type:o.post_method,
				url:internal.uri,
				data:cleaned_data,
				success:function(d,ts,xhr){
					internal.base_data = $.extend(internal.base_data,cleaned_data);
					callback(d);
				}
			});

		};
		
		
		
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.MerlinData = MerlinData;
	
}(this, this.jQuery));