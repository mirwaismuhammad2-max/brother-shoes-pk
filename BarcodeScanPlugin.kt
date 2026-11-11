package com.brothershoes.app.plugins

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning

/**
 * JS name: BarcodeScan  ->  scan()  =>  { value } or { cancelled: true }
 * Uses Google's code scanner (ML Kit): it brings its own camera screen, so no CAMERA permission is needed.
 */
@CapacitorPlugin(name = "BarcodeScan")
class BarcodeScanPlugin : Plugin() {

    @PluginMethod
    fun scan(call: PluginCall) {
        val options = GmsBarcodeScannerOptions.Builder()
            .setBarcodeFormats(
                Barcode.FORMAT_CODE_128, Barcode.FORMAT_EAN_13, Barcode.FORMAT_EAN_8,
                Barcode.FORMAT_UPC_A, Barcode.FORMAT_UPC_E, Barcode.FORMAT_CODE_39, Barcode.FORMAT_QR_CODE
            )
            .enableAutoZoom()
            .build()

        GmsBarcodeScanning.getClient(activity, options).startScan()
            .addOnSuccessListener { barcode ->
                val value = barcode.rawValue
                if (value.isNullOrBlank()) call.resolve(JSObject().put("cancelled", true))
                else call.resolve(JSObject().put("value", value))
            }
            .addOnCanceledListener { call.resolve(JSObject().put("cancelled", true)) }
            .addOnFailureListener { call.reject(it.message ?: "Scanner failed") }
    }
}
