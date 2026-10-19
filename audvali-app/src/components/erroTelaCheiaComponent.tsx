import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface ErroProps {
  mensagem: string;
  onRetry?: () => void;
}

export default function ErroTelaCheia({ mensagem, onRetry }: ErroProps) {
  const [blink, setBlink] = useState(false);

  const imgA = require("../assets/images/error.png");
  const imgB = require("../assets/images/error_p.png");

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>

        <Image source={blink ? imgB : imgA} style={styles.image} />

        <Text style={styles.title}>Ocorreu um Erro</Text>

        <Text style={styles.message}>{mensagem}</Text>

        {onRetry && (
          <TouchableOpacity
            style={styles.button}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 300,
    padding: 32,
    backgroundColor: "#FF4444",
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 16,
    marginBottom: 40,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#FF4444",
    fontWeight: "bold",
    fontSize: 16,
  },
});
