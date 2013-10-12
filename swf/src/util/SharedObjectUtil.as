package util {

import flash.net.SharedObject;

public class SharedObjectUtil {
		/**
		 * 从SharedObject读值
		 * @param name 存储文件名
		 * @param localPath 存储文件路径
		 * @param secure
		 */
		public static function read(name:String, localPath:String = null, secure:Boolean = false):Object {
			try {
				var so:SharedObject = SharedObject.getLocal(name, localPath, secure);
				so.flush();
			} catch(err:Error) {
			}
			if (so != null) {
				return so.data;
			}
			return null;
		}

		/**
		 * 将对象写入SharedObject
		 * @param name 对象的名字
		 * @param value 对象值
		 * @param name 存储文件名
		 * @param localPath 存储文件路径
		 * @param secure
		 */
		public static function write(key:String, value:Object, name:String, localPath:String = null, secure:Boolean = false):void {
			try {
				var so:SharedObject = SharedObject.getLocal(name, localPath, secure);
			} catch(err:Error) {
			}
			if (so != null && so.data) {
				so.data[key] = value;
				so.flush();
			}
		}
	}
}
