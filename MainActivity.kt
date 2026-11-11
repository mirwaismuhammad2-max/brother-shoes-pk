package com.brothershoes.app

import android.os.Bundle
import com.brothershoes.app.plugins.BarcodeScanPlugin
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(BarcodeScanPlugin::class.java)   // must come before super.onCreate
        super.onCreate(savedInstanceState)
    }
}
