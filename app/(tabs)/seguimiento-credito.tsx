import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import AsesorCard from "@/components/TarjetaAsesor";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Trimestre {
  id: number;
  nombre: string;
}

export default function SeguimientoCreditoScreen() {
  const [trimestres, setTrimestres] = useState<Trimestre[]>([]);
  const [trimestreNombre, setTrimestreNombre] = useState("");
  const [trimestreId, setTrimestreId] = useState<number | undefined>(undefined);
  const [cantidad, setCantidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [docName, setDocName] = useState("");
  const [documento, setDocumento] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [stage, setStage] = useState<"idle" | "loading" | "success">("idle");
  const [userName, setUserName] = useState<string | null>(null);

  const router = useRouter();
  const usuarioId = 1;
  const BACKEND_BASE_URL = "http://192.168.68.117:4000";

  useEffect(() => {
    const fetchTrimestres = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/trimestres/trimestre`);
        const data = await response.json();
        setTrimestres(data);
      } catch (error) {
        console.error("Error al obtener trimestres:", error);
      }
    };

    fetchTrimestres();
  }, []);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result.canceled && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        setDocName(selectedFile.name || "Documento seleccionado");
        setDocumento(selectedFile);
      }
    } catch (error) {
      console.error("Error al seleccionar documento:", error);
    }
  };

  const handleCreateComprobante = async () => {
    if (!trimestreNombre.trim() || !cantidad.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    const trimestreEncontrado = trimestres.find(
      (t) => t.nombre.toLowerCase() === trimestreNombre.toLowerCase()
    );

    if (!trimestreEncontrado) {
      Alert.alert("Error", "El trimestre ingresado no existe.");
      return;
    }

    setTrimestreId(trimestreEncontrado.id);
    setStage("loading");

    const formData = new FormData();
    formData.append("usuario_id", usuarioId.toString());
    formData.append("trimestre_id", trimestreEncontrado.id.toString());
    formData.append("cantidad_factura", cantidad);
    formData.append("descripcion", descripcion);
    formData.append("comentarios_adicionales", comentarios);

    if (documento?.uri) {
      formData.append("documento_pdf", {
        uri: documento.uri,
        name: documento.name || "documento.pdf",
        type: documento.mimeType || "application/pdf",
      } as any);
    }

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/comprobantes/crearComprobante`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Éxito", "Comprobante guardado correctamente.");
        setStage("success");
      } else {
        Alert.alert("Error", data.mensaje || "No se pudo guardar.");
        setStage("idle");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error de conexión", "Hubo un problema con la conexión al servidor.");
      setStage("idle");
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setUserName(storedName);
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    if (stage === "success") {
      setTrimestreNombre("");
      setCantidad("");
      setDescripcion("");
      setComentarios("");
      setDocName("");
      setDocumento(null);

      setTimeout(() => {
        setStage("idle");
        router.replace("/historial-credito"); 
      }, 3000);
    }
  }, [stage, router]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {userName || "Julia"}!</Text>
        <Text style={styles.subtitle}>Seguimiento de tu crédito</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Escribe el nombre del Trimestre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: Q1-2025"
          value={trimestreNombre}
          onChangeText={setTrimestreNombre}
        />

        <TextInput style={styles.input} placeholder="Cantidad" keyboardType="numeric" value={cantidad} onChangeText={setCantidad} />
        <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
        <TextInput style={styles.input} placeholder="Comentarios" value={comentarios} onChangeText={setComentarios} />

        <TouchableOpacity style={styles.uploadButton} onPress={handlePickDocument}>
          <Text style={styles.uploadButtonText}>Cargar Documento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleCreateComprobante}>
          <Text style={styles.buttonText}>Crear Comprobante</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 20 }}>
        <AsesorCard nombre="Juan Perez" cargo="Asesor de crédito" telefono="+526141088379" imagenUrl="https://randomuser.me/api/portraits/men/32.jpg" />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7A3E9D',
  },
  subtitle: {
    fontSize: 18,
    color: '#7A3E9D',
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#FFF',
    marginBottom: 15,
    overflow: 'hidden', // Asegura que el picker no sobresalga
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  input: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#7A3E9D',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#7A3E9D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  docName: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
});
