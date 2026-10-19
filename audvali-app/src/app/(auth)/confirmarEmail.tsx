import { useState, useEffect } from "react";
import { Alert, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router";
import { useConfirmarEmail, useReenviarCodigo } from "@/modules/emails/email.hook";

export default function ConfirmaEmailScreen(){
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();
    const {handleConfirmarEmail, loading: loadingConfirmar, error: errorConfirmar, success: successConfirmar} = useConfirmarEmail();
    const {handleReenviarCodigo, loading: loadingReenviar, error: errorReenviar, success: successReenviar} = useReenviarCodigo();
    const [codigo, setCodigo] = useState("");
    const [tempoRestante, setTempoRestante] = useState(0);

    useEffect(() => {
    if (tempoRestante === 0) return;

    const intervalo = setInterval(() => {
        setTempoRestante((tempo) => tempo - 1);
    }, 1000);

    return () => clearInterval(intervalo);
    }, [tempoRestante]);

    const onConfirmarEmailPress = async () => {
        await handleConfirmarEmail(email, codigo);
    };
    const onReenviarCodigoPress = async () => {
        await handleReenviarCodigo(email);
        setTempoRestante(60);
    };
    if(successConfirmar){
        Alert.alert("Sucesso", "E-mail confirmado",[
            {
                text: "Avançar",
                onPress: () => router.replace("/(auth)/loginColaborador")
            }
        ]);
    };
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.logo}>Confirmar E-mail</Text>
                {(errorConfirmar || errorReenviar) && (
                    <Text style={styles.errorText}>
                        {errorConfirmar || errorReenviar}
                    </Text>
                )}
                <Text style={styles.label}>Código de Confirmação</Text>
                <TextInput
                    style={[styles.input, errorConfirmar && !codigo && styles.inputError]}
                    placeholder="Digite o código enviado para o seu e-mail."
                    value={codigo}
                    onChangeText={setCodigo}
                    keyboardType="numeric"
                    maxLength={6}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={onReenviarCodigoPress}
                    disabled={tempoRestante > 0 || loadingReenviar}
                >
                    <Text style={styles.buttonText}>
                        {tempoRestante > 0
                        ? `Reenviar código (${tempoRestante}s)`
                        : "Reenviar código"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onConfirmarEmailPress}
                    disabled={loadingConfirmar}
                >
                    {loadingConfirmar ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Confirmar</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  innerContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  label: { fontSize: 16, marginBottom: 5, color: "#666" },
  input: {
    backgroundColor: "#FFF",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  inputError: { borderColor: "#FF3B30" },
  errorText: { color: "#FF3B30", textAlign: "center", marginBottom: 10 },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  link: { marginTop: 20, textAlign: "center", color: "#007AFF", fontSize: 14 },
});