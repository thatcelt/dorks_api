let ActivityThread, eInstance, q5Instance, keyStoreService, listener, SystemClock, StandardCharsets, JavaString;

const createNVContext = (NVClass, appContext, Context) => {
    const MyNVContext = Java.registerClass({
        name: "MyNVContext",
        implements: [NVClass],
        methods: {
            getContext: function () {
                return Java.cast(appContext, Context);
            },
            getContextId: function () {
                return 0;
            },
            getParentContext: function () {
                return null;
            },
            getService: function (str) {
                return null;
            },
            startActivity: function (intent) {
                console.log("[*] startActivity(intent):", intent.toString());
            }
        }
    });

    return MyNVContext.$new();
}

const createListener = (onSuccess) => {
    const BACallback = Java.use("z.b$a");

    const MyBACallback = Java.registerClass({
        name: "MyBACallback",
        implements: [BACallback],
        methods: {
            onSuccess: onSuccess,
            onFailure: function (exception) {
                send({ t: 'GET_INTEGRITY_TOKEN_ERROR', error: exception.getMessage() })
            }
        }
    });

    return MyBACallback.$new();
}

Java.perform(function () {
    eInstance = Java.use('y.e').$new();
    q5Instance = Java.use('c.f.b.e.q5').$new();
    ActivityThread = Java.use("android.app.ActivityThread");
    SystemClock = Java.use("android.os.SystemClock");
    StandardCharsets = Java.use("java.nio.charset.StandardCharsets");
    JavaString = Java.use('java.lang.String');

    const NVContext = Java.use("com.narvii.app.NVContext");
    const Context = Java.use("android.content.Context");

    const appContext = Java.use("android.app.ActivityThread")
        .currentApplication()
        .getApplicationContext();

    const myNVContext = createNVContext(NVContext, appContext, Context);

    keyStoreService = Java.use("com.narvii.security.KeyStoreService").$new(myNVContext);;
    listener = createListener((token) => {
        send({ token: token.toString(), t: 'GET_INTEGRITY_TOKEN' })
    })
    
});

const getContext = () => {
    let app = ActivityThread.currentApplication();
    if (app === null) {
        app = ActivityThread.currentActivityThread().getApplication();
    }
    return app.getApplicationContext();
}

const hasAlias = (alias) => {
    return eInstance.g().containsAlias(alias);
}

const createKeyPair = (alias) => {
    if (hasAlias(alias)) {
        return false;
    };
    
    const keyPair = eInstance.b(getContext(), alias, true, null, false);
    return keyPair !== null && keyPair.getPublic() !== null;
}

const deleteEntry = (alias) => {
    if (!hasAlias(alias)) {
        return false;
    }

    eInstance.g().deleteEntry(alias);
    return true;
}

const getCertificateChain = (alias) => {
    if (!hasAlias(alias)) {
        return [];
    };
    
    return eInstance.c(getContext(), alias);
}

const signECDSA = (data, alias) => {
    if (!hasAlias(alias)) {
        return null;
    }
    const byteArray = JavaString.$new(data).getBytes()

    return eInstance.q(byteArray, alias);
}

const sendPlayIntegrityToken = () => {
    keyStoreService.getAppCheckToken(listener);
};

const getElapsedRealtime = () => {
    return SystemClock.elapsedRealtime();
};

rpc.exports = {
    hasAlias: hasAlias,
    createKeyPair: createKeyPair,
    deleteEntry: deleteEntry,
    getCertificateChain: getCertificateChain,
    signECDSA: signECDSA,
    sendPlayIntegrityToken: sendPlayIntegrityToken,
    getElapsedRealtime: getElapsedRealtime
};