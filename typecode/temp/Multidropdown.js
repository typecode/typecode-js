//Tbe only difference with this dropdown is that you add "tc-multiple" in classes.
<div id="my-multidropdown" class="tc-field tc-dropdown tc-multiple">
	<div class="display"></div>
	<div class="menu">
		<div data-value="-1" class="item state-empty">Select a Train</div>
//You can take away <input type="checkbox"> if you don't want to see check boxes, the red highlighting will still allow you to distinguish what are selected.		
		<div data-value="1" class="item"><input type="checkbox">A,B,C Train</div>
		<div data-value="2" class="item"><input type="checkbox">N,Q,R Train</div>
		<div data-value="3" class="item"><input type="checkbox">B,D,F,M Train</div>
		<div data-value="4" class="item"><input type="checkbox">1,2,3 Train</div>
		<div data-value="5" class="item"><input type="checkbox">4,5,6 Train</div>
		<div data-value="6" class="item"><input type="checkbox">7 Train</div>
	</div>
</div>  