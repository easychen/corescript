function Game_LogBase(){
    this.initialize.apply(this,arguments);
}

Game_LogBase.prototype.initialize = function(){
    this._additionalLog =[];
};

Game_LogBase.prototype.createMessage = function(){
    return 'unknown error';
};

Game_LogBase.prototype.createErrorHTML = function(){
    var addError = this.createAdditionalError('<br>');
    return this.createMessage() +addError+ '<hr><br>';
};

Game_LogBase.prototype.createConsoleMessage = function(){
    return this.createMessage() + this.createAdditionalError("\n");
};

Game_LogBase.prototype.addLog = function(text){
    if(!this._additionalLog){
        this._additionalLog =[];
    }
    this._additionalLog.push(text);
};

Game_LogBase.prototype.createAdditionalError = function(brStr){
    if(!this._additionalLog){return "";}
    var result =brStr;
    for(var i=0; i < this._additionalLog.length; ++i){
        result +=  this._additionalLog[i] + brStr;
    }
    return result;
};

function Game_LogMapEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogMapEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogMapEvent.prototype.constructor = Game_LogMapEvent;

Game_LogMapEvent.prototype.initialize = function(mapId,eventId,page){
    this._mapId = mapId;
    this._eventId = eventId;
    this._page = page;
};

Game_LogMapEvent.prototype.event = function(){
    if($gameMap.mapId() === this._mapId){
        var event = $gameMap.event(this._eventId);
        if(event){
            return event;
        }
    }
    return null;
};

Game_LogMapEvent.prototype.getEventName = function(){
    var event = this.event();
    if(event){
        return event.debugName();
    }
    return "";
}

Game_LogMapEvent.prototype.createMessage = function(){
    var event = this.event();
    if(event){
        return ( "MapID: %1,%2, page: %3").format(this._mapId,event.debugName(),this._page+1);
    }
    return "";
};


function Game_LogMoveRoute(){
    this.initialize.apply(this,arguments);
}
Game_LogMoveRoute.prototype = Object.create(Game_LogBase.prototype);
Game_LogMoveRoute.prototype.constructor = Game_LogCommonEvent;
Game_LogMoveRoute.prototype.initialize =function(sorce){
    this._moveRouteSorce =sorce;
    this._eventCommandLine =NaN;
    this._moveRouteIndex =NaN;
};
Game_LogMoveRoute.prototype.sorceMessage =function(){
    if(this._moveRouteSorce){
        return this._moveRouteSorce.createMessage();
    }
    return 'unknown';
};
Game_LogMoveRoute.prototype.createMessage =function(){
    return 'moveRouteError';
};
Game_LogMoveRoute.prototype.setEventCommandLine =function(index){
    this._eventCommandLine = index;
};

Game_LogMoveRoute.prototype.setMoveRouteIndex = function(index){
    this._moveRouteIndex = index;
};
Game_LogMoveRoute.prototype.createLineMassage =function(){
    var moveRouteIndex =(this._moveRouteIndex || 0) +1;
    if(isNaN(this._eventCommandLine)){
        return '(MoveRouteCostom) line:'+moveRouteIndex;
    }
    return 'line:'+( this._eventCommandLine+ 1 + moveRouteIndex);
};

Game_LogMoveRoute.prototype.createAdditionalError =function(brStr){
    var origin= Game_LogBase.prototype.createAdditionalError.call(this,brStr);
    return (brStr+'sorce:'+this.sorceMessage() +
            brStr +this.createLineMassage() +
            origin);
};
function Game_LogCommonEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogCommonEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogCommonEvent.prototype.constructor = Game_LogCommonEvent;

Game_LogCommonEvent.prototype.initialize = function(eventId){
    this._eventId = eventId;
    this._parent =null;
};

Game_LogCommonEvent.prototype.getEventName = function(){
    var event = $dataCommonEvents[this._eventId];
    if(event){
        if(event.name ===''){
            return 'unnamed';
        }
        return event.name;
    }
    return "";
};

Game_LogCommonEvent.prototype.createMessage = function(){
    var name = this.getEventName();
    return("CommonEvent: %1(%2)").format(
        this._eventId ,
        name
    );
};

function Game_LogBattleEvent(){
    this.initialize.apply(this,arguments);
}

Game_LogBattleEvent.prototype = Object.create(Game_LogBase.prototype);
Game_LogBattleEvent.prototype.constructor = Game_LogBattleEvent;
Game_LogBattleEvent.prototype.initialize = function(troopId,page){
    this._troopId = troopId;
    this._page =page;
};

Game_LogBattleEvent.prototype.getEventName = function(){
    var troop = $dataTroops[this._troopId];
    if(troop){
       return troop.name;
    }
    return "";
};

Game_LogBattleEvent.prototype.createMessage = function(){
    var name = this.getEventName();
    return ("BattleEvent TroopID: %1(%2), page: %3").format(
        this._troopId,
        name,
        1+this._page 
    );
};

function Game_LogEventTest(){
    this.initialize.apply(this,arguments);
}

Game_LogEventTest.prototype = Object.create(Game_LogBase.prototype);
Game_LogEventTest.prototype.constructor = Game_LogBattleEvent;

Game_LogEventTest.prototype.initialize = function(){
};

Game_LogEventTest.prototype.createMessage = function(){
    return ('EventTest');
};

