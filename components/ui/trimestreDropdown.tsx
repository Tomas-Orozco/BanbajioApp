import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface TrimestreDropdownProps {
  onSelect: (trimestreId: number) => void;
}

const BACKEND_URL = "http://192.168.1.97:4000";

export default function TrimestreDropdown({ onSelect }: TrimestreDropdownProps) {
  const [trimestres, setTrimestres] = useState<{ label: string; value: number }[]>([]);
  const [trimestreId, setTrimestreId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchTrimestres = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/trimestres/trimestre`);
        const data = await response.json();

        setTrimestres(
          data.map((t: { id: number; nombre: string }) => ({
            label: t.nombre,
            value: t.id,
          }))
        );
      } catch (error) {
        console.error("Error al obtener trimestres:", error);
      }
    };

    fetchTrimestres();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona un trimestre:</Text>

      <DropDownPicker
        open={dropdownOpen}
        value={trimestreId}
        items={trimestres}
        setOpen={setDropdownOpen}
        setValue={setTrimestreId}
        setItems={setTrimestres}
        placeholder="Selecciona un trimestre"
        dropDownContainerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        onChangeValue={(value) => {
          if (value !== null) {
            setTrimestreId(value);
            onSelect(value);
          }
        }}
      />

      {trimestreId !== null && (
        <Text style={styles.selectedText}>
          Trimestre Seleccionado: {trimestres.find((t) => t.value === trimestreId)?.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 100, 
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    backgroundColor: "#FFF",
    zIndex: 100,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    zIndex: 100,
  },
  selectedText: {
    marginTop: 10,
    fontWeight: "bold",
  },
});
