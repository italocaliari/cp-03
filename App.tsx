import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  StyleSheet, Text, View, TextInput, ScrollView, 
  TouchableOpacity, Alert, Switch 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formConfig } from './src/config/formConfig';
import { FormDataState, FormField } from './src/types';

export default function App() {
  const [formData, setFormData] = useState<FormDataState>({});

  // useEffect: Recupera dados ao iniciar
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const saved = await AsyncStorage.getItem('@form_data');
        if (saved) setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    };
    loadSavedData();
  }, []);

  // useCallback: Atualiza o estado
  const handleUpdate = useCallback((id: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  }, []);

  // useMemo: Validação básica de campos obrigatórios
  const isRequiredFilled = useMemo(() => {
    return formConfig.fields
      .filter(f => f.required)
      .every(f => {
        const val = formData[f.id];
        return val !== undefined && val !== null && String(val).trim() !== '';
      });
  }, [formData]);

  // Função de Validação de Regras de Negócio
  const validateForm = (): boolean => {
    // 1. Regra de E-mail
    const email = String(formData['email'] || '');
    if (email && !email.includes('@')) {
      Alert.alert('Erro de Validação', 'O e-mail deve conter "@".');
      return false;
    }

    // 2. Regra de Idade
    const age = Number(formData['age']);
    if (formData['age'] !== undefined && (isNaN(age) || age < 0 || age > 110)) {
      Alert.alert('Erro de Validação', 'A idade deve ser um número entre 0 e 110.');
      return false;
    }

    // 3. Regra de Data (Formato DD/MM/AAAA)
    const date = String(formData['birthDate'] || '');
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (date && !dateRegex.test(date)) {
      Alert.alert('Erro de Validação', 'A data deve estar no formato DD/MM/AAAA.');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!isRequiredFilled) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios (*).');
      return;
    }

    if (!validateForm()) return;

    try {
      await AsyncStorage.setItem('@form_data', JSON.stringify(formData));
      Alert.alert('Sucesso', 'Dados validados e salvos com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Erro ao salvar localmente.');
    }
  };

  const handleClear = async () => {
    setFormData({});
    await AsyncStorage.removeItem('@form_data');
    Alert.alert('Limpo', 'Dados removidos do dispositivo.');
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id];

    if (field.type === 'switch' || field.type === 'checkbox') {
      return (
        <View style={styles.switchRow}>
          <Switch 
            value={!!value} 
            onValueChange={(val) => handleUpdate(field.id, val)} 
            trackColor={{ false: "#ccc", true: "#007AFF" }}
          />
          <Text style={styles.switchText}>{value ? 'Sim' : 'Não'}</Text>
        </View>
      );
    }

    if (field.type === 'radio' || field.type === 'select') {
      return (
        <View style={styles.optionsContainer}>
          {field.options?.map(opt => (
            <TouchableOpacity 
              key={opt.value} 
              style={[styles.optionBtn, value === opt.value && styles.optionBtnActive]}
              onPress={() => handleUpdate(field.id, opt.value)}
            >
              <Text style={[styles.optionText, value === opt.value && styles.textWhite]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <TextInput
        style={[styles.input, field.type === 'multiline' && styles.textArea]}
        secureTextEntry={field.type === 'password'}
        keyboardType={
          field.id === 'age' ? 'number-pad' : 
          (field.type === 'email' ? 'email-address' : 'default')
        }
        multiline={field.type === 'multiline'}
        placeholder={field.type === 'date' ? 'DD/MM/AAAA' : `Digite aqui...`}
        value={String(value || '')}
        onChangeText={(val) => handleUpdate(field.id, val)}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerTitle}>{formConfig.title}</Text>

        {formConfig.fields.map(field => (
          <View key={field.id} style={styles.card}>
            <Text style={styles.label}>
              {field.label} {field.required && <Text style={{ color: 'red' }}>*</Text>}
            </Text>
            {renderField(field)}
          </View>
        ))}

        <TouchableOpacity 
          style={[styles.saveBtn, !isRequiredFilled && styles.btnDisabled]} 
          onPress={handleSave}
        >
          <Text style={styles.btnText}>SALVAR E VALIDAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
          <Text style={styles.clearBtnText}>Limpar Dados Salvos</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f5f7fb' },
  scrollContainer: { padding: 20, paddingBottom: 50 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 25, color: '#333' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 10, color: '#555', textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: '#e1e4e8', borderRadius: 8, padding: 12, fontSize: 16, color: '#333', backgroundColor: '#fafbfc' },
  textArea: { height: 90, textAlignVertical: 'top' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switchText: { fontSize: 16, color: '#666' },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionBtn: { paddingVertical: 10, paddingHorizontal: 18, borderWidth: 1, borderColor: '#007AFF', borderRadius: 25 },
  optionBtnActive: { backgroundColor: '#007AFF' },
  optionText: { color: '#007AFF', fontWeight: 'bold' },
  textWhite: { color: '#fff' },
  saveBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  btnDisabled: { backgroundColor: '#b3d7ff' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  clearBtn: { marginTop: 20, alignItems: 'center' },
  clearBtnText: { color: '#ff4d4d', fontWeight: 'bold', textDecorationLine: 'underline' }
});