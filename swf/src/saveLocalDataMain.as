/**
 * Created by IntelliJ IDEA.
 * User: Administrator
 * Date: 13-8-28
 * Time: 上午10:14
 * To change this template use File | Settings | File Templates.
 */
package {
import flash.display.MovieClip;
import flash.display.Sprite;
import flash.events.Event;
import flash.events.MouseEvent;
import flash.external.ExternalInterface;
import flash.text.TextField;
import flash.text.TextFieldType;

import util.SharedObjectUtil;

[SWF(backgroundColor="0xF0F0F0", width=400, height=400, frameRate="12")]
public class saveLocalDataMain extends Sprite{
    public function saveLocalDataMain() {
        if (stage) {
            init();
        }else{
            addEventListener(Event.ADDED_TO_STAGE, addOnStage);
        }
    }

    private function addOnStage(event:Event):void {
        removeEventListener(Event.ADDED_TO_STAGE, addOnStage);
        init();
    }

    private function init():void {
        if (ExternalInterface.available) {
            ExternalInterface.addCallback("write", onWrite);
            ExternalInterface.addCallback("read", onRead);
        }
		var textF:TextField = new TextField();
		addChild(textF);
		textF.text = "ok";
		textF.type = TextFieldType.INPUT;
		var btn:MovieClip = new MovieClip();
		var txt:TextField = new TextField();
		txt.text = "保存";
		txt.mouseEnabled = false;
		btn.addChild(txt);
		addChild(btn);
		btn.x = 30;
		btn.y = 30;
		btn.buttonMode = true;
		btn.addEventListener(MouseEvent.CLICK,clickHandler);	

    }
	private function clickHandler(e:MouseEvent):void
	{
		trace(22222);
		
		SharedObjectUtil.write("1",key:20,"name");
		var obj:Object = SharedObjectUtil.read("name");
		var textF:TextField = new TextField();
		addChild(textF);
		textF.x += 100;
		textF.text = obj.key;
		
	}

    private function onRead(name:String):void {
        SharedObjectUtil.read(name);
    }

    private function onWrite(key:String, value:Object, name:String):void {
        SharedObjectUtil.write(key, value, name);

    }
}
}
