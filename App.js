import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDu7xK9mQ2pL5nR8sT1uV2wX3yZ4aB5cD6',
  authDomain: 'gtd-app-12345.firebaseapp.com',
  projectId: 'gtd-app-12345',
  storageBucket: 'gtd-app-12345.appspot.com'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [tarefas, setTarefas] = React.useState([]);

  React.useEffect(() => {
    carregarTarefas();
  }, []);

  async function carregarTarefas() {
    try {
      const snapshot = await getDocs(collection(db, 'usuarios/usuario_demo_123/caixa_entrada'));
      const dados = [];
      snapshot.forEach((doc) => {
        dados.push({ id: doc.id, ...doc.data() });
      });
      setTarefas(dados);
      Alert.alert('GTD', 'Tarefas: ' + dados.length);
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  }

  async function adicionarTarefa() {
    try {
      await addDoc(collection(db, 'usuarios/usuario_demo_123/caixa_entrada'), {
        titulo: 'Nova tarefa',
        status: 'entrada',
        data_captura: new Date().toISOString()
      });
      Alert.alert('Sucesso', 'Tarefa adicionada!');
      carregarTarefas();
    } catch (e) {
      Alert.alert('Erro', e.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>📋 GTD APP</Text>
      <TouchableOpacity style={styles.btn} onPress={carregarTarefas}>
        <Text style={styles.btnText}>Carregar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, {backgroundColor: '#28a745'}]} onPress={adicionarTarefa}>
        <Text style={styles.btnText}>Adicionar</Text>
      </TouchableOpacity>
      <Text style={styles.info}>Total: {tarefas.length}</Text>
      {tarefas.map((t) => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.cardText}>{t.titulo}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  btn: { backgroundColor: '#17a2b8', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  info: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#666' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 5, borderLeftWidth: 4, borderLeftColor: '#17a2b8' },
  cardText: { fontSize: 14, color: '#333' }
});
