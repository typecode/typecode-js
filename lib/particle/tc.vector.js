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

if(!tc){ var tc = {}; }

(function(tc) {

	tc.vector_2d = function(src_array){
		this.elements = src_array;
	};

	tc.vector_2d.prototype.elements = [0,0];

	tc.vector_2d.prototype.setElements = function vector_2d_setElements(new_elements){
		this.elements = new_elements;
	};

	tc.vector_2d.prototype.add = function vector_2d_add(vector){
		var V;
		V = vector.elements || vector;
		return new tc.vector_2d([this.elements[0]+V[0], this.elements[1]+V[1]]);
	};

	tc.vector_2d.prototype.subtract = function vector_2d_subtract(vector){
		var V;
		V = vector.elements || vector;
		return new tc.vector_2d([this.elements[0]-V[0], this.elements[1]-V[1]]);
	};

	tc.vector_2d.prototype.multiply = function vector_2d_multiply(factor){
		return new tc.vector_2d([this.elements[0]*factor, this.elements[1]*factor]);
	};

	tc.vector_2d.prototype.dot = function vector_2d_dot(vector){
		var V, product;
		V = vector.elements || vector;
		product = 0;
		product += this.elements[0] * V[0];
		product += this.elements[1] * V[1];
		return product;
	};
	
})(tc);