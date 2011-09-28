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
			data:{}
		},options);
		
		internal = {
			data:o.data
		};
		
		this.populate_fields = function(me,fields){
			
			var i;
			
			if(fields){
				for(i in fields){
					if(me.internal.current_step.inputs[fields[i]] && internal.data[fields[i]]){
						me.internal.current_step.inputs[fields[i]].component.set_val(this.get_val(fields[i]),true);
					}
				}
			} else {
				for(i in this.get_data()){
					if(me.internal.current_step.inputs[i]){
						me.internal.current_step.inputs[i].component.set_val(this.get_val(i),true);
					}
				}
			}
			
		};
		
		this.collect_fields = function(me, fields){
			
			var i;
			
			if(fields){
				for(i in fields){
					if(me.internal.current_step.inputs[fields[i]] && this.get_val(fields[i])){
						this.set_val(fields[i], me.internal.current_step.inputs[fields[i]].get_val());
					}
				}
			} else {
				for(i in this.get_data()){
					if(me.internal.current_step.inputs[i]){
						this.set_val(i, me.internal.current_step.inputs[i].component.get_val());
					}
				}
			}
			
		};
		
		this.get_data = function(){
			return internal.data;
		};
		
		this.set_data = function(new_data){
			internal.data = new_data;
		};
		
		this.get_val = function(id){
			return internal.data[id];
		};
		
		this.set_val = function(id,new_val){
			internal.data[id] = new_val;
		};
		
		this.post_data = function(callback){
			setTimeout(callback,300);
		};
		
		
		
	};
	
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
		
	NI.MerlinData = MerlinData;
	
}(this, this.jQuery));