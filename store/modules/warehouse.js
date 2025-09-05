// src/store/warehouse.js
export default {
    namespaced: true,
    state: {
      suppliers: [], // 存储所有供应商信息
      filteredSuppliers: [], // 存储过滤后的供应商信息，用于搜索结果
    },
    getters: {
      allSuppliers: state => state.suppliers,
      filteredSuppliers: state => state.filteredSuppliers,
    },
    mutations: {
      setSuppliers(state, suppliers) {
        state.suppliers = suppliers;
        state.filteredSuppliers = suppliers; // 初始化时，过滤列表与全列表相同
      },
      setFilteredSuppliers(state, filteredSuppliers) {
        state.filteredSuppliers = filteredSuppliers;
      },
    },
    actions: {
      async fetchSuppliers({ commit }) {
        try {
          const response = await getSuppliers(); // 使用之前定义的 getSuppliers API 函数
          if (response.code === 0) {
            commit('setSuppliers', response.data);
          }
        } catch (error) {
          console.error('Failed to fetch suppliers:', error);
        }
      },
      filterSuppliersByName({ commit }, searchQuery) {
        const suppliers = this.state.warehouse.suppliers;
        const filteredSuppliers = suppliers.filter(supplier =>
          supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        commit('setFilteredSuppliers', filteredSuppliers);
      },
    },
  };