// Script: 'mycommon.js' , generated by Gamedonia
define({
	 toEntityData:function toEntityData(obj){
	        var entity = gamedonia.data.newEntity();
	        for(prop in obj){
	            entity.put(prop,obj[prop]);
	        }
	        return entity;
	    }
});