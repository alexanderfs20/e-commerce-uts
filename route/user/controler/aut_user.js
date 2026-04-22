const users = [];

// ====================== REGISTER ======================
app.post('/register', (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, dan role harus diisi'
      });
    }

    const userExists = users.find(u => u.username === username);

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'Username sudah terdaftar'
      });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: role.toLowerCase(),
      created: new Date()
    };

    users.push(newUser);

    return res.status(201).json({
      success: true,
      message: `Berhasil daftar sebagai ${newUser.role}`,
      data: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
});


// ====================== LOGIN ======================
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    const foundUser = users.find(u => u.username === username);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'Username tidak ditemukan'
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password salah'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        id: foundUser.id,
        username: foundUser.username
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server'
    });
  }
});


// ====================== KATALOG ======================
app.get('/customer/katalog', (req, res) => {
  try {
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maaf, saat ini belum ada barang yang dijual.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil memuat daftar barang',
      total: products.length,
      data: products
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data'
    });
  }
});


// ====================== KATEGORI ======================
app.get('/customer/kategori', (req, res) => {
  try {
    const { cari } = req.query;

    if (!cari) {
      return res.status(400).json({
        success: false,
        message: 'Tentukan kategori yang dicari'
      });
    }

    const hasilFilter = products.filter(
      p => p.kategori.toLowerCase() === cari.toLowerCase()
    );

    return res.status(200).json({
      success: true,
      kategori: cari,
      jumlah: hasilFilter.length,
      data: hasilFilter
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan'
    });
  }
});


// ====================== DETAIL BARANG ======================
app.get('/customer/barang/:id', (req, res) => {
  try {
    const idBarang = parseInt(req.params.id);
    const item = products.find(p => p.id === idBarang);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Barang tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});