/*!
 * BikeWar TypeScript SDK
 * http://www.codeofwar.net
 *
 *
 * Copyright 2014 Tamina
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * author : david mouton
 */

declare function postMessage( message:any ):void;

/**
 * Le nom de l'IA
 * @property name
 * @type String
 */
var name:string = "noname";


var color:number = 0;

/**
 * Le message à sortir dans la console à la fin du tour
 * @property debugMessage
 * @type String
 */
var debugMessage:string = "";

/**
 * Id de l'IA
 * @property id
 * @type String
 */
var id:number = 0;


/**
 * @internal method
 */
onmessage = function ( event ) {
    if ( event.data != null ) {
        var turnMessage = event.data;
        id = turnMessage.playerId;
        var orders = [];
        var msg = "";
        try {
            orders = getOrders(turnMessage.data);
            msg = debugMessage;
        } catch ( e ) {
            msg = 'Error : ' + e;
        }
        postMessage(new TurnResult(orders, msg));
    }
    else postMessage("data null");
};

/**
 * Cette méthode est appelée par le système tout les tours
 * @method getOrders
 * @param    context {MapData} l'ensemble des données de la partie
 * @return    result {Array<Order>} la liste des ordres à exécuter ce tour
 */
var getOrders = function ( context:MapData ):Order[] {
    var result:Order[] = [];
    return result;
};

/**
 * La Map
 * <br/> Contient l'ensemble des données de la partie
 * @class MapData
 * @constructor
 */
class MapData {
    /**
     * La liste des joueurs
     * @property players
     * @type Array<Player>
     */
    public players:Player[];

    /**
     * La liste des stations de vélo
     * @property stations
     * @type Array<BikeStation>
     */
    public stations:BikeStation[];

    /**
     * La liste des camions
     * @property trucks
     * @type Array<Truck>
     */
    public trucks:Truck[];

    /**
     * La date courante
     * @property currentTime
     * @type Date
     */
    public currentTime:Date;

    /**
     * La liste des routes
     * @property roads
     * @type Array<Junction>
     */
    public roads:Junction[];
}

/**
 * Station de Vélo
 * @class BikeStation
 * @constructor
 */
class BikeStation {
    /**
     * L'id de la station
     * @property id
     * @type Float
     */
    public id:number;

    /**
     * Le nombre de vélo
     * @property bikeNum
     * @type Int
     */
    public bikeNum:number;

    /**
     * Le nombre d'emplacement pour vélo
     * @property slotNum
     * @type Int
     */
    public slotNum:number;

    /**
     * La position de la station sur la Map
     * @property position
     * @type Junction
     */
    public position:Junction;

    /**
     * Le proprietaire
     * @property owner
     * @type Player
     */
    public owner:Player;

    /**
     * Le profil de la station.
     * le nombre moyen de vélo en station entre 00h00 et 23h45, toutes les 15 minutes.
     * @property profile
     * @type Array<Int>
     */
    public profile:number[];

    /**
     * Le nom de la station
     * @property name
     * @type String
     */
    public name:string;

}
;

/**
 * Classe de base des Ordres à éxécuter par le systeme
 * @class Order
 */
class Order {
    /**
     * L'id du camion concerné par cet ordre
     * @property truckId
     * @type Float
     * @static
     */
    public truckId:number;

    /**
     * La station concernée par cet ordre
     * @property targetStationId
     * @type Float
     * @static
     */
    public targetStationId:number;

    /**
     * Le type d'ordre cet ordre. Voir {{#crossLink "OrderType"}} OrderType {{/crossLink}}
     * @property type
     * @type String
     * @static
     */
    public type:string;

    constructor( truckId:number, targetStationId:number, type:string ) {
        this.truckId = truckId;
        this.targetStationId = targetStationId;
        this.type = type;
    }
}
;

/**
 * Ordre de déplacement
 * @class MoveOrder
 * @constructor
 * @param    truckId  {Float} L'id du camion concerné par cet ordre
 * @param    targetStationId {Float} La station de destination
 */
class MoveOrder extends Order {

    constructor( truckId:number, targetStationId:number ) {
        super(truckId, targetStationId, OrderType.MOVE);
    }
}
;

/**
 * Ordre de chargement
 * @class LoadingOrder
 * @constructor
 * @param    truckId  {Float} L'id du camion concerné par cet ordre
 * @param    targetStationId {Float} La station de destination
 * @param    bikeNum {Int} Le nombre de vélo à charger
 */
class LoadingOrder extends Order {

    constructor( truckId:number, targetStationId:number, bikenum:number ) {
        super(truckId, targetStationId, OrderType.LOAD);
        this.bikeNum = bikenum;
    }


    /**
     * Le nombre de vélo à charger
     * @property bikeNum
     * @type Int
     */
    public bikeNum:number;
}
;

/**
 * Ordre de déchargement des vélos
 * @class UnLoadingOrder
 * @constructor
 * @param    truckId  {Float} L'id du camion concerné par cet ordre
 * @param    targetStationId {Float} La station ciblée
 * @param    bikeNum {Int} Le nombre de vélo à décharger
 */
class UnLoadingOrder extends Order {

    constructor( truckId:number, targetStationId:number, bikenum:number ) {
        super(truckId, targetStationId, OrderType.UNLOAD);
        this.bikeNum = bikenum;
    }

    /**
     * Le nombre de vélo à décharger
     * @property bikeNum
     * @type Int
     */
    public bikeNum:number;
}
;

/**
 * Enumeration des types d'ordres
 * @class OrderType
 */
class OrderType {

    /**
     * Ordre de déplacement
     * @property MOVE
     * @type String
     */
    public static MOVE:string = "move";

    /**
     * Ordre de chargement de vélo
     * @property LOAD
     * @type String
     */
    public static LOAD:string = "load";

    /**
     * Ordre de déchargement de vélo
     * @property UNLOAD
     * @type String
     */
    public static UNLOAD:string = "unload";

    /**
     * Ordre de rien du tout
     * @property NONE
     * @type String
     */
    public static NONE:string = "none";
}


/**
 * Joueur
 * @class Player
 * @constructor
 * @param    name {String}
 * @param    color {String}
 * @param    script {String}
 */
class Player {
    /**
     * Le nom de l'IA
     * @property name
     * @type String
     */
    public name:string;
    public script:string;
    public color:string;

    /**
     * Id de l'IA
     * @property id
     * @type String
     */
    public id:string;

    constructor( name:string, script:string, color:string ) {
        this.id = UID.get();
    }
}
;

/**
 * @internal method
 */
class TurnMessage {

    playerId:string;
    data:Galaxy;

    constructor( playerId:string, data:MapData ) {
        this.playerId = playerId;
        this.data = data;
    }

}

/**
 * @internal method
 */
class TurnResult {

    orders:Order[];
    consoleMessage:string;
    error:string;

    constructor( orders:Order[], message:string = "" ) {
        this.orders = orders;
        this.consoleMessage = message;
        this.error = "";
    }

}


/**
 * @class Point
 * @param x:Number
 * @param y:Number
 */
class Point {
    public x:number;
    public y:number;

    constructor( x:number, y:number ) {
        this.x = x;
        this.y = y;
    }
}
;

/**
 * @class Junction
 * @extends Point
 * @param x:Number
 * @param y:Number
 * @param id:String
 */
class Junction extends Point {

    constructor( x:number, y:number, id:string ) {
        super(x, y);
        this.id = id;
        this.links = [];
    }

    /**
     * La liste des Junction liées
     * @property links
     * @type Array<Junction>
     */
    public links:Junction[];
    public id:string;


    public bikeNum:number;
}
;

/**
 * Tendance d'une Station
 * @class Trend
 */
class Trend {

    /**
     * Décroissante
     * @property DECREASE
     * @type Int
     * @default -1
     * @static
     */
    public static DECREASE:number = -1;

    /**
     * Croissante
     * @property INCREASE
     * @type Int
     * @default 1
     * @static
     */
    public static INCREASE:number = 1;

    /**
     * Stable
     * @property STABLE
     * @type Int
     * @default 0
     * @static
     */
    public static STABLE:number = 0;

}
;

/**
 * Camion
 * @class Truck
 */
class Truck {

    constructor( owner:Player, currentStation:BikeStation ) {
        this.owner = owner;
        this.currentStation = currentStation;
        this.id = UID.get();
    }

    /**
     * L'Id du camion
     * @property id
     * @type Float
     */
    public id:number;

    /**
     * Le proprietaire du camion
     * @property owner
     * @type Player
     */
    public owner:Player;

    /**
     * Le nombre de vélo embarqué
     * @property bikeNum
     * @type Int
     */
    public bikeNum:number;

    /**
     * La position du camion
     * @property position
     * @type Point
     */
    public position:Point;

    /**
     * Si il s'y trouve, la station actuelle.
     * @property currentStation
     * @type BikeStation
     */
    public currentStation:BikeStation;

}

/**
 * Classe utilitaire
 * @class GameUtils
 */
class GameUtils {
    /**
     * Indique le nombre de tour necessaire à un camion pour aller d'une station à une autre
     * @method getTravelDuration
     * @param    source {BikeStation} la station d'origine
     * @param   target {BikeStation} la station de destination
     * @param   map {MapData} la map
     * @return    result {Int} le nombre de tour
     * @static
     */
    public static getTravelDuration( source:BikeStation, target:BikeStation, map:MapData ):number {
        var result:number = 0;
        var p = GameUtils.getPath(source, target, map);
        var _g1 = 0;
        var _g = p.get_length() - 1;
        while ( _g1 < _g ) {
            var i = _g1++;
            result += Math.ceil(GameUtils.getDistanceBetween(p.getItemAt(i), p.getItemAt(i + 1)) / Game.TRUCK_SPEED);
        }
        return result;
    }

    /**
     * Détermine la distance qui sépare deux Points en pixel
     * @method getDistanceBetween
     * @param    p1 {Point} le point d'origine
     * @param   p2 {Point} le point de destination
     * @return    result {Int} le nombre de pixel
     * @static
     */
    public static getDistanceBetween( p1:Point, p2:Point ):number {
        return Math.sqrt(Math.pow(( p2.x - p1.x ), 2) + Math.pow(( p2.y - p1.y ), 2));
    }

    /**
     * Si la station se trouve dans sa zone optimale
     * @method hasStationEnoughBike
     * @param    station {BikeStation} la station
     * @return    result {Bool}
     * @static
     */
    public static hasStationEnoughBike( station:BikeStation ):Boolean {
        return (station.bikeNum > station.slotNum / 4 && station.bikeNum < station.slotNum / 4 * 3);
    }

    /**
     * Récupere le chemin le plus court entre deux stations
     * @method getPath
     * @param    fromStation {BikeStation} la station d'origine
     * @param   toStation {BikeStation} la station de destination
     * @param   map {MapData} la map
     * @return    result {Path} le chemin
     * @static
     */
    public static getPath( fromStation:BikeStation, toStation:BikeStation, map:MapData ):Path {
        var p = new PathFinder();
        return p.getPath(fromStation, toStation, map);
    }

    /**
     * Indique la tendance d'une station à un instant particulier
     * @method getBikeStationTrend
     * @param    target {BikeStation} la station
     * @param   time {Date} l'heure de la journée
     * @return    result {Trend} la tendance
     * @static
     */
    public static getBikeStationTrend( target:BikeStation, time:Date ) {
        var currentIndex = time.getHours() * 4 + Math.floor(time.getMinutes() * 4 / 60);
        var nextIndex = currentIndex + 1;
        if ( nextIndex + 1 > target.profile.length ) {
            nextIndex = 0;
        }
        return target.profile[nextIndex] - target.profile[currentIndex];
    }

}

/**
 * Classe utilitaire
 * @internal
 */
class UID {
    private static lastUID = 0;

    public static get() {
        lastUID++;
        return lastUID;
    }
}

/**
 * Constantes du jeu
 * @class Game
 */
class Game {
    /**
     * La vitesse d'execution d'un tour.
     * @property GAME_SPEED
     * @type Int
     * @static
     */
    public static GAME_SPEED = 1000;
    /**
     * Le nombre maximum de tour
     * @property GAME_MAX_NUM_TURN
     * @type Int
     * @static
     */
    public static GAME_MAX_NUM_TURN = 500;
    /**
     * La vitesse d'un camion
     * @property TRUCK_SPEED
     * @type Int
     * @static
     */
    public static TRUCK_SPEED = 60;
    /**
     * La capacité d'un camion
     * @property TRUCK_NUM_SLOT
     * @type Int
     * @static
     */
    public static TRUCK_NUM_SLOT = 10;
    /**
     * La durée maximale du tour d'une IA. Si l'IA dépasse cette durée, elle passe en timeout.
     * @property MAX_TURN_DURATION
     * @type Int
     * @static
     */
    public static MAX_TURN_DURATION = 1000;
    /**
     * La durée d'un tour en ms. ex 15 minutes/tours
     * @property TURN_TIME
     * @type Int
     * @static
     */
    public static TURN_TIME = 1000 * 30 * 15;
}

class PathFinder {
    private _inc = 0;
    private _paths:Path[];
    private _source:Junction;
    private _target:Junction;
    private _map:MapData;
    private _result:Path;

    constructor() {
        this._paths = [];
    }

    public getPath( fromStation:BikeStation, toStation:BikeStation, map:MapData ):Path {
        this._map = map;
        this._source = this.getJunctionByStation(fromStation);
        this._target = this.getJunctionByStation(toStation);
        var p = new Path();
        p.push(this._source);
        this._paths.push(p);
        this.find();
        return this._result;
    }

    public getJunctionByStation( station:BikeStation ):Junction {
        var result:Junction = null;
        var _g1 = 0;
        var _g = this._map.roads.length;
        while ( _g1 < _g ) {
            var i = _g1++;
            var j = this._map.roads[i];
            if ( j.x == station.position.x && j.y == station.position.y ) {
                result = j;
                break;
            }
        }
        return result;
    }

    public find():Boolean {
        var result = false;
        this._inc++;
        var paths = this._paths.slice();
        var _g1 = 0;
        var _g = paths.length;
        while ( _g1 < _g ) {
            var i = _g1++;
            if ( this.checkPath(paths[i]) ) {
                result = true;
                break;
            }
        }
        if ( !result && this._inc < 50 ) this.find();
    }

    public checkPath( target:Path ):Boolean {
        var result = false;
        var currentJunction = target.getLastItem();
        var _g1 = 0;
        var _g = currentJunction.links.length;
        while ( _g1 < _g ) {
            var i = _g1++;
            var nextJunction = currentJunction.links[i];
            if ( nextJunction.id == this._target.id ) {
                result = true;
                var p = target.copy();
                p.push(nextJunction);
                this._result = p;
                break;
            } else if ( !Path.contains(nextJunction, this._paths) ) {
                var p1 = target.copy();
                p1.push(nextJunction);
                this._paths.push(p1);
            }
        }
        HxOverrides.remove(this._paths, target);
        return result;
    }

    public checkPathDirection( currentJunction:Junction ):Boolean {
        var result = true;
        if ( this._inc > 2 ) {
            if ( this._source.x < this._target.x && currentJunction.x < this._source.x ) result = false; else if ( this._source.x > this._target.x && currentJunction.x > this._target.x ) result = false;
        }
        return result;
    }

}

class Path  {

    private _content:Junction[];

    constructor( content:Junction[] ) {
        if (content == null) {
            _content =[];
        } else {
            _content = content;
        }
    }

    public static contains( item:Junction, list:Path[] ):Boolean {
        var result = false;
        var _g1 = 0;
        var _g = list.length;
        while ( _g1 < _g ) {
            var i = _g1++;
            if ( list[i].hasItem(item) ) {
                result = true;
                break;
            }
        }
        return result;
    }
}

Path.prototype = {
    getLastItem: function () {
        return this._content[this._content.length - 1];
    }, hasItem: function ( item ) {
        var result = false;
        var _g1 = 0;
        var _g = this._content.length;
        while ( _g1 < _g ) {
            var i = _g1++;
            if ( item.id == this._content[i].id ) {
                result = true;
                break;
            }
        }
        return result;
    }, getGuide: function () {
        var result = new Array();
        var _g1 = 0;
        var _g = this._content.length;
        while ( _g1 < _g ) {
            var i = _g1++;
            result.push(this._content[i].x - 8);
            result.push(this._content[i].y - 8);
        }
        return result;
    }, getItemAt: function ( index ) {
        return this._content[index];
    }, push: function ( item ) {
        this._content.push(item);
    }, remove: function ( item ) {
        return HxOverrides.remove(this._content, item);
    }, copy: function () {
        return new com.tamina.bikewar.data.Path(this._content.slice());
    }, get_length: function () {
        return this._content.length;
    }
};

var HxOverrides = function () {
};
HxOverrides.__name__ = true;
HxOverrides.indexOf = function ( a, obj, i ) {
    var len = a.length;
    if ( i < 0 ) {
        i += len;
        if ( i < 0 ) i = 0;
    }
    while ( i < len ) {
        if ( a[i] === obj ) return i;
        i++;
    }
    return -1;
};
HxOverrides.remove = function ( a, obj ) {
    var i = HxOverrides.indexOf(a, obj, 0);
    if ( i == -1 ) return false;
    a.splice(i, 1);
    return true;
};



