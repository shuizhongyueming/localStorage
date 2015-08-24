package 
{
    import flash.display.*;
    import flash.events.*;
    import flash.external.*;
    import flash.system.*;
    import saveLocalDataMain.*;
    import util.*;

    public class saveLocalDataMain extends Sprite
    {
        private var jsCallBack:String;
        private var domain:String;

        public function saveLocalDataMain()
        {
            Security.allowDomain("*");
            if (stage)
            {
                this.init();
            }
            else
            {
                addEventListener(Event.ADDED_TO_STAGE, this.addOnStage);
            }
            return;
        }// end function

        private function addOnStage(event:Event) : void
        {
            removeEventListener(Event.ADDED_TO_STAGE, this.addOnStage);
            this.init();
            return;
        }// end function

        private function init() : void
        {
            this.jsCallBack = root.loaderInfo.parameters["callback"];
            this.domain = root.loaderInfo.parameters["domain"];
            if (ExternalInterface.available)
            {
                ExternalInterface.addCallback("setItem", this.onWrite);
                ExternalInterface.addCallback("getItem", this.onRead);
                ExternalInterface.addCallback("removeItem", this.onRemove);
                ExternalInterface.addCallback("clear", this.onClear);
                ExternalInterface.addCallback("key", this.onKey);
            }
            if (ExternalInterface.available)
            {
                ExternalInterface.call(this.jsCallBack, this.domain);
            }
            return;
        }// end function

        private function onKey(index) : Object
        {
            var _loc_4:String = null;
            var _loc_2:* = SharedObjectUtil.read("7k7kso");
            var _loc_3:Array = [];
            for (_loc_4 in _loc_2)
            {
                
                _loc_3.push(_loc_4);
            }
            if (index < _loc_3.length)
            {
                return _loc_3[index];
            }
            return null;
        }// end function

        private function onClear() : void
        {
            SharedObjectUtil.clearAll("7k7kso");
            return;
        }// end function

        private function onRemove(key:String) : void
        {
            var _loc_2:* = SharedObjectUtil.read("7k7kso");
            delete _loc_2[key];
            SharedObjectUtil.flush("7k7kso");
            return;
        }// end function

        private function onRead(key:String) : String
        {
            var _loc_2:* = SharedObjectUtil.read("7k7kso");
            if (_loc_2.hasOwnProperty(key))
            {
                return _loc_2[key];
            }
            return null;
        }// end function

        private function onWrite(key:String, value:Object) : void
        {
            SharedObjectUtil.write(key, value, "7k7kso");
            return;
        }// end function

    }
}
