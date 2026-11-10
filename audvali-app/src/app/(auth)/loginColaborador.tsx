import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native"
import { useRouter } from "expo-router";
import { useLogin } from "@/modules/auths/auth.hook";

interface ILoginResponse{
    mensagem: string | null;
    senhaExpirou: boolean;
}

export default function LoginColaboradorScreen(){
    const router = useRouter();
    const { handleLogin, loading, error, success } = useLogin();
    const [modoAdmin, setModoAdmin] = useState(false);
    const [loginResponse, setLoginResponse] = useState<ILoginResponse | null>(null);
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const onLoginPress = async () =>{
       setLoginResponse(await handleLogin(usuario, senha, modoAdmin));
       if(modoAdmin && loginResponse?.senhaExpirou){
         router.replace("/alterarSenhaAdministrador");
       } else if(modoAdmin){
         router.replace("/dashboard");
       } else{
         router.replace("/");
       }
    };
    if(success){
        Alert.alert(
            "Login",
            "Logado com sucesso."
        )
    }
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.logo}>AppAudVali</Text>

                {modoAdmin && <Text style={styles.subtitulo}>Acesso administrativo</Text>}

                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o seu e-mail"
                    value={usuario}
                    onChangeText={setUsuario}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                style={styles.input}
                placeholder="Digite a sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={onLoginPress}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : ( 
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>

                {!modoAdmin && (
                    <TouchableOpacity onPress={() => router.replace("/cadastroColaborador")}>
                        <Text style={{ textAlign: "center", marginTop: 20, color: "#007AFF" }}>Criar conta</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => setModoAdmin((atual) => !atual)}>
                    <Text style={styles.linkSecundario}>
                        {modoAdmin ? "Sou colaborador" : "Sou administrador"}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  input: {
    backgroundColor: "#FFF",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  button: {
    backgroundColor: "#007AFF",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitulo: {
    textAlign: "center",
    marginTop: -30,
    marginBottom: 30,
    color: "#666",
  },
  linkSecundario: {
    textAlign: "center",
    marginTop: 30,
    color: "#999",
    fontSize: 14,
   },
});
