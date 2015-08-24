package util
{
    import flash.net.*;

    public class SharedObjectUtil extends Object
    {

        public function SharedObjectUtil()
        {
            return;
        }// end function

        public static function read(name:String, localPath:String = null, secure:Boolean = false) : Object
        {
            var _loc_4:SharedObject = null;
            try
            {
                _loc_4 = SharedObject.getLocal(name, localPath, secure);
                _loc_4.flush();
            }
            catch (err:Error)
            {
            }
            if (_loc_4 != null)
            {
                return _loc_4.data;
            }
            return null;
        }// end function

        public static function write(key:String, value:Object, name:String, localPath:String = null, secure:Boolean = false) : void
        {
            var _loc_6:SharedObject = null;
            try
            {
                _loc_6 = SharedObject.getLocal(name, localPath, secure);
            }
            catch (err:Error)
            {
            }
            if (_loc_6 != null)
            {
            }
            if (_loc_6.data)
            {
                _loc_6.data[key] = value;
                _loc_6.flush();
            }
            return;
        }// end function

        public static function clearAll(name:String, localPath:String = null, secure:Boolean = false) : void
        {
            var _loc_4:SharedObject = null;
            try
            {
                _loc_4 = SharedObject.getLocal(name, localPath, secure);
            }
            catch (err:Error)
            {
            }
            _loc_4.clear();
            return;
        }// end function

        public static function flush(name:String, localPath:String = null, secure:Boolean = false) : void
        {
            var _loc_4:SharedObject = null;
            try
            {
                _loc_4 = SharedObject.getLocal(name, localPath, secure);
            }
            catch (err:Error)
            {
            }
            if (_loc_4 != null)
            {
                _loc_4.flush();
            }
            return;
        }// end function

    }
}
