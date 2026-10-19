import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../assets/colors/paleta01";
import { Ionicons } from "@expo/vector-icons";

interface ErroComponenteProps {
  erro: string | Record<string, string> | undefined;
}

const Erro: React.FC<ErroComponenteProps> = ({ erro }) => {
  if (!erro) return null;
  const mensagem =
    typeof erro === "string" ? erro : Object.values(erro).join(" * ");
  return (
    <View style={styles.container}>
      <Ionicons name="warning" size={16} color="white" style={styles.icon} />

      <Text style={styles.text} numberOfLines={2}>
        {mensagem}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.brand.red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    maxWidth: "100%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    flexShrink: 1,
  },
});

export default Erro;
